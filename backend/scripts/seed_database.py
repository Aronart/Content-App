from sqlalchemy.orm import Session
from src.database.session import SessionLocal, engine
from src.database import models
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()
    try:
        # Create a source config
        source_config = models.SourceConfig(
            name="YouTube Gaming Channel",
            platform=models.Platform.YOUTUBE,  
            credentials={
                "api_key": "dummy_key",
                "channel_id": "dummy_channel"
            },
            parameters={
                "search_query": "gaming highlights",
                "max_duration": 600,
                "min_views": 1000
            },
            schedule_settings={
                "frequency": "daily",
                "time": "09:00"
            }
        )
        db.add(source_config)
        db.flush()

        # Create an editing pipeline
        editing_pipeline = models.EditingPipeline(
            name="Gaming Highlights Pipeline",
            transformation_config={
                "steps": [
                    {
                        "type": "trim",  
                        "params": {"max_duration": 60}
                    },
                    {
                        "type": "subtitles",  
                        "params": {"language": "en"}
                    }
                ]
            }
        )
        db.add(editing_pipeline)
        db.flush()

        # Create a destination account
        destination_account = models.DestinationAccount(
            platform=models.Platform.TIKTOK,  
            account_name="GamingHighlights",
            credentials={
                "access_token": "dummy_token",
                "refresh_token": "dummy_refresh"
            },
            schedule_settings={
                "post_times": ["12:00", "18:00", "21:00"],
                "timezone": "UTC"
            }
        )
        db.add(destination_account)
        db.flush()

        # Create a content flow
        content_flow = models.ContentFlow(
            name="YouTube to TikTok Gaming Flow",
            source_config_id=source_config.id,
            editing_pipeline_id=editing_pipeline.id,
            destination_account_id=destination_account.id,
            quota_settings={
                "daily_limit": 5,
                "time_between_posts": 3600,
                "blackout_periods": []
            },
            schedule_settings={
                "active_days": ["monday", "wednesday", "friday"],
                "active_hours": ["09:00-22:00"]
            },
            is_active=True,
            require_approval=True
        )
        db.add(content_flow)
        db.flush()

        # Create some queue items
        for i in range(3):
            queue_item = models.ContentQueueItem(
                source_platform=models.Platform.YOUTUBE,  
                source_url=f"https://youtube.com/watch?v=dummy{i}",
                source_data={
                    "title": f"Gaming Highlight {i}",
                    "description": "Awesome gaming moment",
                    "duration": 300,
                    "views": 5000
                },
                content_flow_id=content_flow.id,
                status=models.ContentStatus.PENDING,  
                scheduled_time=datetime.utcnow() + timedelta(hours=i)
            )
            db.add(queue_item)

        # Commit all changes
        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
