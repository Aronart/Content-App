from celery import Celery
from sqlalchemy.orm import Session
from database.models import ContentFlow, Platform, Transformation
from source_adapters.registry import SourceRegistry
from editing.effects.registry import TransformationRegistry
from editing.pipeline import TransformationPipeline
from upload.platforms.registry import UploadRegistry

app = Celery('content_bot')
app.config_from_object('celeryconfig')
app.conf.beat_scheduler = 'celery.beat.schedulers.DatabaseScheduler'


@app.task
def source_and_edit(flow_id):
    session = Session()
    flow = session.query(ContentFlow).filter_by(id=flow_id).first()

    if not flow:
        print(f"Content flow {flow_id} not found.")
        return

    if not flow.secondary_condition:
        print(f"Secondary condition not met for flow {flow_id}. Skipping.")
        return

    try:
        # Initialize the source adapter
        source_config = flow.source_config
        platform = Platform(source_config.platform)
        adapter_class = SourceRegistry.get_adapter(platform)
        source_adapter = adapter_class(source_config.credentials, source_config.parameters)

        # Initialize the transformation pipeline
        transformationPipeline = TransformationPipeline()
        for name in flow.editing_pipeline.transformation_config["names"]:
            transformation = Transformation(name)
            transformation_class = TransformationRegistry.get_transformation(transformation)
            transformation_instance = transformation_class(
                flow.editing_pipeline.transformation_config["names"][name]["parameters"]
            )
            transformationPipeline.add_step(transformation_instance)

        # Initialize the upload adapter
        destination_account = flow.destination_account
        upload_adapter_class = UploadRegistry.get_adapter(Platform(destination_account.platform))
        upload_adapter = upload_adapter_class(destination_account.account_name, destination_account.credentials)

        # Process the content flow
        content = source_adapter.fetch_content()
        edited_content = transformationPipeline.execute(content)

        #create content_queue item
        

        print(f"Content flow {flow_id} processed successfully.")

    except Exception as e:
        print(f"Error processing flow {flow_id}: {e}")
        # Handle error logging or re-queuing if needed

        # self.error_manager.handle_error(e, {"context": "system_initialization"})
        # raise
    

@app.task
def check_and_post_content():
    # Task logic for checking and posting content
    conn = psycopg2.connect("dbname=content_bot user=postgres")
    cur = conn.cursor()

    # Get items ready for posting
    cur.execute("""
        SELECT * FROM content_queue
        WHERE status = 'approved'
        AND posting_schedule <= NOW()
        LIMIT 10
    """)
    items = cur.fetchall()

    for item in items:
        # Dispatch a posting task for each ready item
        if item.certain_condition:
            post_content.delay(item['id'])

    cur.close()
    conn.close()


@app.task(bind=True, max_retries=3)
def post_content(self, video_id):
    try:
        session = Session()
        flow = session.query(ContentFlow).filter_by(id=video_id).first()
        # Initialize the upload adapter
        destination_account = flow.destination_account
        upload_adapter_class = UploadRegistry.get_adapter(Platform(destination_account.platform))
        upload_adapter = upload_adapter_class(destination_account.account_name, destination_account.credentials)

        #get content queue item

        conn = psycopg2.connect("dbname=content_bot user=postgres")
        cur = conn.cursor()

        # Fetch the video item
        cur.execute("SELECT * FROM content_queue WHERE id = %s", (video_id,))
        video = cur.fetchone()

        if not video:
            print(f"Video {video_id} not found.")
            return

        # Simulate posting
        print(f"Posting {video['video_path']} to {video['destination_account']}...")
        print(f"Successfully posted {video['video_path']}")

        # Update status
        cur.execute("UPDATE content_queue SET status = 'posted', updated_at = NOW() WHERE id = %s", (video_id,))
        conn.commit()
    except Exception as exc:
        print(f"Failed to post video {video_id}: {exc}")
        self.retry(exc=exc, countdown=60)
    finally:
        cur.close()
        conn.close()

