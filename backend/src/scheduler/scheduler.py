from celery import Celery
from sqlalchemy.orm import Session, joinedload
from src.database.models import (
    ContentFlow,
    Platform,
    Transformation,
    ContentQueueItem,
    ContentStatus,
    GlobalConfig,
    PostedItem,
)
from src.source_adapters.registry import SourceRegistry
from src.editing.effects.registry import TransformationRegistry
from src.editing.pipeline import TransformationPipeline
from src.upload.registry import UploadRegistry
from src.database.session import SessionLocal
from sqlalchemy import func
from datetime import datetime

app = Celery("ContentApp")
app.config_from_object("celeryconfig")
app.conf.beat_scheduler = "celery.beat.schedulers.DatabaseScheduler"


@app.task
def source_and_edit(flow_id):
    db = SessionLocal()
    try:
        flow = db.query(ContentFlow).filter_by(id=flow_id).first()

        if not flow:
            print(f"Content flow {flow_id} not found.")
            return

        if not flow.secondary_condition:
            print(f"Secondary condition not met for flow {flow_id}. Skipping.")
            return

        # Initialize the source adapter
        source_config = flow.source_config
        platform = Platform(source_config.platform)
        adapter_class = SourceRegistry.get_adapter(platform)
        source_adapter = adapter_class(
            source_config.credentials, source_config.parameters
        )

        # Initialize the transformation pipeline
        transformationPipeline = TransformationPipeline()
        for name in flow.editing_pipeline.transformation_config["names"]:
            transformation = Transformation(name)
            transformation_class = TransformationRegistry.get_transformation(
                transformation
            )
            transformation_instance = transformation_class(
                flow.editing_pipeline.transformation_config["names"][name]["parameters"]
            )
            transformationPipeline.add_step(transformation_instance)

        # Initialize the upload adapter
        destination_account = flow.destination_account
        upload_adapter_class = UploadRegistry.get_adapter(
            Platform(destination_account.platform)
        )
        upload_adapter = upload_adapter_class(
            destination_account.account_name, destination_account.credentials
        )

        # Process the content flow
        content = source_adapter.fetch_content()
        edited_content = transformationPipeline.execute(content)

        # Create ContentQueueItem
        queue_item = ContentQueueItem(
            source_platform=platform,
            source_url=content.get('url'),  # Assuming content has a url field
            source_data=content,  # Store the original content data
            edited_content_path=edited_content.get('path'),  # Assuming edited_content has a path field
            content_flow_id=flow_id,
            preview_path=edited_content.get('preview_path'),  # If you have a preview
            status=ContentStatus.PENDING,  # Start with PENDING status
            scheduled_time=flow.schedule_settings.get('posting_time'),  # Get scheduled time from flow settings
        )

        db.add(queue_item)
        db.commit()

        print(f"Content flow {flow_id} processed successfully. Created queue item {queue_item.id}")

    except Exception as e:
        print(f"Error processing flow {flow_id}: {e}")
        db.rollback()  # Make sure to rollback in case of error
        raise
    finally:
        db.close()


@app.task
def check_and_post_content():
    db = SessionLocal()
    try:
        # Get global config
        global_config = db.query(GlobalConfig).first()
        
        # Get items ready for posting using SQLAlchemy - only filter by schedule time
        ready_items = (
            db.query(ContentQueueItem)
            .options(joinedload(ContentQueueItem.content_flow))
            .filter(
                ContentQueueItem.scheduled_time <= func.now()
            )
            .limit(10)
            .all()
        )

        for item in ready_items:
            if not item.content_flow:
                print(f"Content flow not found for queue item {item.id}")
                continue

            # Check if approval is required (either globally or per flow)
            approval_required = global_config.require_approval or item.content_flow.require_approval

            # Determine if we can post this item
            can_post = (
                # Either approval is not required
                (not approval_required) or
                # Or approval is required AND item is approved
                (approval_required and item.status == ContentStatus.APPROVED)
            )

            if can_post and item.certain_condition:
                post_content.delay(item.id)
                print(f"Queued item {item.id} for posting")
            else:
                reason = "awaiting approval" if approval_required and item.status != ContentStatus.APPROVED else "conditions not met"
                print(f"Skipping item {item.id} - {reason}")

    except Exception as e:
        print(f"Error checking content queue: {e}")
        raise
    finally:
        db.close()


@app.task(bind=True, max_retries=3)
def post_content(self, content_id):
    db = SessionLocal()
    try:
        content_item = db.query(ContentQueueItem).get(content_id)
        if not content_item:
            raise ValueError(f"Content item {content_id} not found")

        # Post the content using the upload adapter
        destination_account = content_item.content_flow.destination_account
        upload_adapter_class = UploadRegistry.get_adapter(
            Platform(destination_account.platform)
        )
        upload_adapter = upload_adapter_class(
            destination_account.account_name, destination_account.credentials
        )

        # Attempt to post the content
        posting_result = upload_adapter.post_content(content_item.edited_content_path)
        
        # Create PostedItem entry
        posted_item = PostedItem(
            original_queue_item_id=content_item.id,
            content_flow_id=content_item.content_flow_id,
            source_platform=content_item.source_platform,
            source_url=content_item.source_url,
            source_data=content_item.source_data,
            edited_content_path=content_item.edited_content_path,
            destination_platform=destination_account.platform,
            destination_account_id=destination_account.id,
            performance_metrics={"initial_post_status": posting_result}
        )
        
        # Add and commit the posted item
        db.add(posted_item)
        
        # Delete the queue item
        db.delete(content_item)
        
        # Commit both operations
        db.commit()
        
        print(f"Successfully posted and archived content item {content_id}")

    except Exception as e:
        print(f"Error posting content {content_id}: {e}")
        db.rollback()
        raise self.retry(exc=e, countdown=60 * 5)  # Retry in 5 minutes
    finally:
        db.close()
