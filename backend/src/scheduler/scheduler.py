"""Task scheduler for content processing."""

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
    SourceRateLimit,
    DestinationRateLimit,
)
from src.source_adapters.registry import SourceRegistry
from src.editing.effects.registry import TransformationRegistry
from src.editing.pipeline import TransformationPipeline
from src.upload.registry import UploadRegistry
from src.database.session import SessionLocal
from sqlalchemy import func
from datetime import datetime, timezone
from src.logging.log_manager import LogManager, LogLevel
from zoneinfo import ZoneInfo
from config import Settings

log_manager = LogManager()
logger_name = "scheduler"

settings = Settings()

app = Celery("ContentApp")
app.config_from_object("celeryconfig")
app.conf.beat_scheduler = "celery.beat.schedulers.DatabaseScheduler"


def _should_reset_rate_limit(rate_limit):
    """Check if rate limit should be reset based on last action time.
    
    Args:
        rate_limit: Either a SourceRateLimit or DestinationRateLimit instance
    """
    if not rate_limit.last_action_at:
        return True
    
    now = datetime.now(timezone.utc)
    last_action = rate_limit.last_action_at.replace(tzinfo=timezone.utc)
    
    # Reset if it's a new day (UTC)
    return now.date() > last_action.date()


def reset_rate_limit(rate_limit, db):
    """Reset rate limit counter and update last action time.
    
    Args:
        rate_limit: Either a SourceRateLimit or DestinationRateLimit instance
        db: Database session
    """
    rate_limit.current_action_count = 0
    rate_limit.last_action_at = datetime.now(timezone.utc)
    db.add(rate_limit)
    
    log_manager.info(
        logger_name,
        f"Reset rate limit for {rate_limit.name}"
    )


def update_rate_limit(rate_limit, db):
    """Update rate limit after an action.
    
    Args:
        rate_limit: Either a SourceRateLimit or DestinationRateLimit instance
        db: Database session
    """
    rate_limit.current_action_count += 1
    rate_limit.last_action_at = datetime.now(timezone.utc)
    db.add(rate_limit)


def check_time_between_actions(rate_limit):
    """Check if enough time has passed since last action.
    
    Args:
        rate_limit: Either a SourceRateLimit or DestinationRateLimit instance
    """
    if not rate_limit.last_action_at:
        return True

    now = datetime.now(timezone.utc)
    last_action = rate_limit.last_action_at.replace(tzinfo=timezone.utc)
    time_passed = (now - last_action).total_seconds()
    min_seconds = rate_limit.min_time_between_actions

    return time_passed >= min_seconds


def _is_posting_time(schedule, current_time):
    """Check if current time matches the schedule.
    
    Args:
        schedule: Dict with days, times, and timezone (from PostSchedule schema)
        current_time: UTC datetime to check
        
    Returns:
        bool: True if current_time matches schedule or if no schedule
    """
    if not schedule:
        return True
        
    try:
        # Get time in schedule's timezone
        tz = ZoneInfo(schedule["timezone"])
        local_time = current_time.astimezone(tz)
        
        # Check day
        day_map = {
            "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
            "friday": 4, "saturday": 5, "sunday": 6
        }
        schedule_days = [day_map[day] for day in schedule["days"]]  # days are already lowercase from schema
        if local_time.weekday() not in schedule_days:
            return False
        
        # Check time (with configured window)
        current_minutes = local_time.hour * 60 + local_time.minute
        for time_str in schedule["times"]:  # times are already validated by schema
            hour, minute = map(int, time_str.split(":"))
            schedule_minutes = hour * 60 + minute
            if abs(current_minutes - schedule_minutes) <= settings.TASK_INTERVAL:
                return True
                
        return False
    except Exception as e:
        log_manager.error(
            logger_name,
            f"Error checking posting time for schedule {schedule}: {str(e)}"
        )
        return False  # Don't post if we can't validate the schedule


@app.task
def process_all_flows():
    """Process all active content flows."""
    db = SessionLocal()
    try:
        # Get all active flows
        flows = db.query(ContentFlow).filter_by(is_active=True).all()
        now = datetime.now(timezone.utc)
        
        for flow in flows:
            try:
                # Get task ID for this flow
                task_id = f"source_and_edit_{flow.id}"
                
                # Check if task is already running
                inspector = app.control.inspect()
                active_tasks = inspector.active()
                
                # If task is already running, skip
                task_running = False
                if active_tasks:
                    for worker_tasks in active_tasks.values():
                        for task in worker_tasks:
                            if task['id'] == task_id:
                                task_running = True
                                break
                
                if task_running:
                    log_manager.info(
                        logger_name,
                        f"Flow {flow.id} is already being processed, skipping"
                    )
                    continue
                
                source_interval_minutes = 4 * 60 # Default to 4 hour
                if flow.source_interval:
                    source_interval_minutes = flow.source_interval
                
                # Get latest content for this flow
                latest_content = (
                    db.query(ContentQueueItem)
                    .filter_by(content_flow_id=flow.id)
                    .order_by(ContentQueueItem.created_at.desc())
                    .first()
                )
                
                # If no content exists or enough time has passed, process the flow
                should_process = (
                    not latest_content or 
                    (now - latest_content.created_at).total_seconds() / 60 >= source_interval_minutes
                )
                
                if should_process:
                    # Check rate limit before triggering task
                    source_config = flow.source_config
                    if source_config and source_config.rate_limit:
                        rate_limit = source_config.rate_limit
                        
                        if _should_reset_rate_limit(rate_limit):
                            reset_rate_limit(rate_limit, db)
                            
                        if (rate_limit.current_action_count < rate_limit.max_actions_per_day and 
                            check_time_between_actions(rate_limit)):
                            # Apply task with specific task_id but DON'T replace existing
                            source_and_edit.apply_async(args=[flow.id], task_id=task_id)
                            log_manager.info(
                                logger_name,
                                f"Triggered content sourcing for flow {flow.id}"
                            )
                        else:
                            log_manager.info(
                                logger_name,
                                f"Skipping flow {flow.id} due to rate limit"
                            )
                    else:
                        # No rate limit, just process
                        source_and_edit.apply_async(args=[flow.id], task_id=task_id)
                        log_manager.info(
                            logger_name,
                            f"Triggered content sourcing for flow {flow.id}"
                        )
                    
            except Exception as e:
                log_manager.error(
                    logger_name,
                    f"Error processing flow {flow.id}: {str(e)}"
                )
                
    except Exception as e:
        log_manager.error(
            logger_name,
            f"Error in process_all_flows: {str(e)}"
        )
    finally:
        db.close()


@app.task
def source_and_edit(flow_id):
    """Source and edit content for a specific flow."""
    db = SessionLocal()
    try:
        flow = db.query(ContentFlow).get(flow_id)
        if not flow or not flow.is_active:
            log_manager.warning(
                logger_name,
                f"Flow {flow_id} not found or inactive"
            )
            return

        # Get source configuration
        source_config = flow.source_config
        if not source_config:
            log_manager.error(
                logger_name,
                f"Source config not found for flow {flow_id}"
            )
            return

        # Get source adapter and initialize with required parameters
        adapter_class = SourceRegistry.get_adapter(source_config.platform)
        if not adapter_class:
            log_manager.error(
                logger_name,
                f"Source adapter not found for platform {source_config.platform}"
            )
            return
            
        source_adapter = adapter_class(
            content_flow_id=flow_id,
            credentials=source_config.credentials,
            discovery_parameters=source_config.discovery_parameters,
            sourcing_parameters=source_config.sourcing_parameters
        )

        # Source new content
        try:
            content_items = source_adapter.source_content()
            
            if not content_items:
                log_manager.info(
                    logger_name,
                    f"No new content found for flow {flow_id}"
                )
                return
                
            # Update rate limit after successful sourcing
            if source_config.rate_limit:
                update_rate_limit(source_config.rate_limit, db)
                
        except Exception as e:
            log_manager.error(
                logger_name,
                f"Error sourcing content for flow {flow_id}: {str(e)}"
            )
            return

        # Create pipeline for editing
        pipeline = TransformationPipeline(
            flow.editing_pipeline.transformation_config,
            TransformationRegistry
        )

        # Process each content item
        for item in content_items:
            try:
                # Create queue item
                queue_item = ContentQueueItem(
                    content_flow_id=flow.id,
                    source_platform=source_config.platform,
                    source_url=item.url,
                    source_data=item.metadata,
                    status=ContentStatus.EDITING
                )
                db.add(queue_item)
                db.commit()
                
                # Apply editing pipeline
                edited_content = pipeline.process(item)
                
                # Update queue item with edited content
                queue_item.edited_content_path = edited_content.path
                queue_item.preview_path = edited_content.preview_path
                queue_item.status = ContentStatus.READY
                db.add(queue_item)
                db.commit()
                
                log_manager.info(
                    logger_name,
                    f"Successfully processed content for flow {flow_id}"
                )
                
            except Exception as e:
                if queue_item:
                    queue_item.status = ContentStatus.EDITING_ERROR
                    queue_item.error_log = {"error": str(e)}
                    db.add(queue_item)
                    db.commit()
                    
                log_manager.error(
                    logger_name,
                    f"Error processing content item for flow {flow_id}: {str(e)}"
                )
                
    except Exception as e:
        log_manager.error(
            logger_name,
            f"Error in source_and_edit for flow {flow_id}: {str(e)}"
        )
    finally:
        db.close()


@app.task
def check_and_post_content():
    """Check queue items and post content if conditions are met."""
    db = SessionLocal()
    # Check if automatic posting is enabled
    if db.query(GlobalConfig).first().nable_automatic_posting == False:
        log_manager.info(
            logger_name,
            "Automatic posting is disabled, skipping check"
        )
        return
    try:
        now = datetime.now(timezone.utc)
        
        # Get all ready items
        items = (
            db.query(ContentQueueItem)
            .filter(ContentQueueItem.status == ContentStatus.READY)
            .all()
        )

        # Filter items by schedule
        items = [
            item for item in items 
            if item.content_flow and item.content_flow.is_active and 
            _is_posting_time(item.content_flow.post_schedule, now)
        ]

        for item in items:
            # Get rate limit for the destination account
            rate_limit = item.content_flow.destination_account.rate_limit
            if rate_limit:
                if _should_reset_rate_limit(rate_limit):
                    reset_rate_limit(rate_limit, db)

                # Skip if we've hit the daily limit
                if rate_limit.current_action_count >= rate_limit.max_daily_actions:
                    continue

                # Skip if not enough time has passed since last post
                if not check_time_between_actions(rate_limit):
                    continue

                update_rate_limit(rate_limit, db)

            # Check if approval requirement is met
            global_approval_required = db.query(GlobalConfig).first().approval_required
            approavl_required = global_approval_required or item.content_flow.approval_required
            if approavl_required and not item.status == ContentStatus.APPROVED:
                log_manager.info(
                    logger_name,
                    f"Skipping item {item.id} due to approval requirement"
                )
                continue

            # Trigger posting
            post_content.delay(item.id)
            log_manager.info(
                logger_name,
                f"Triggered posting for item {item.id} at {now}"
            )

    except Exception as e:
        log_manager.error(
            logger_name,
            f"Error in check_and_post_content: {str(e)}"
        )
    finally:
        db.close()


@app.task
def post_content(content_id):
    """Post a specific content item."""
    db = SessionLocal()
    try:
        item = db.query(ContentQueueItem).get(content_id)
        if not item:
            log_manager.error(
                logger_name,
                f"Content item {content_id} not found"
            )
            return

        flow = item.content_flow
        if not flow or not flow.is_active:
            log_manager.error(
                logger_name,
                f"Flow not found or inactive for content {content_id}"
            )
            return

        # Get uploader for destination platform
        uploader = UploadRegistry.get_uploader(flow.destination_account.platform)
        if not uploader:
            log_manager.error(
                logger_name,
                f"No uploader found for platform {flow.destination_account.platform}"
            )
            return

        try:
            # Upload the content
            result = uploader.upload_content(
                item.edited_content_path,
                flow.destination_account.credentials
            )

            # Create posted item record with all necessary data
            posted_item = PostedItem(
                content_flow_id=flow.id,
                source_platform=flow.source_config.platform,
                source_url=item.source_url,
                source_data=item.source_data,
                edited_content_path=item.edited_content_path,
                external_id=result.get('id'),  # Platform-specific post ID
                performance_metrics={}  # Initialize empty metrics
            )
            db.add(posted_item)
            
            # Delete the queue item since it's now posted
            db.delete(item)
            db.commit()

            log_manager.info(
                logger_name,
                f"Successfully posted content {content_id} to {flow.destination_account.platform}"
            )

        except Exception as e:
            item.status = ContentStatus.POSTING_ERROR
            item.error_log = {"error": str(e)}
            db.add(item)
            db.commit()
            
            log_manager.error(
                logger_name,
                f"Error posting content {content_id}: {str(e)}"
            )

    except Exception as e:
        log_manager.error(
            logger_name,
            f"Error in post_content for content {content_id}: {str(e)}"
        )
    finally:
        db.close()
