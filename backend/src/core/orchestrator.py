from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging
from sqlalchemy.orm import Session
from pydantic import ValidationError
from celery import Celery
from celery.schedules import crontab

from src.database.models import (
    ContentStatus,
    Platform,
    Transformation,
    GlobalConfig,
    SourceConfig,
    EditingPipeline,
    DestinationAccount,
    ContentQueueItem,
    ContentFlow,
)
from src.source_adapters.registry import SourceRegistry
from src.editing.effects.registry import TransformationRegistry
from src.upload.registry import UploadRegistry
from src.editing.pipeline import TransformationPipeline
from src.error_handling.error_manager import ErrorManager
from src.database.schemas import validate_source_config_parameters

# Initialize Celery
celery_app = Celery('content_app')

class ContentAppOrchestrator:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.error_manager = ErrorManager(logging_level="INFO")

        # Initialize the system
        self.initialize_system()
        self.setup_periodic_tasks()

    def initialize_system(self):
        """Initialize all system components."""
        self.content_flows = self.db.query(ContentFlow).filter_by(is_active=True).all()
        print(f"Initialized with {len(self.content_flows)} active content flows.")

    def setup_periodic_tasks(self):
        """Set up periodic tasks for content flows and other scheduled activities."""
        try:
            # Set up tasks for each content flow using Celery's native beat scheduler
            for flow in self.content_flows:
                schedule = flow.schedule_settings.get("source_schedule", "*/15 * * * *")  # Default to every 15 minutes
                task_name = f"content_flow_{flow.id}"
                
                # Parse crontab components
                minute, hour, day_month, month, day_week = schedule.split()
                
                # Add to beat schedule
                celery_app.conf.beat_schedule[task_name] = {
                    'task': 'src.scheduler.scheduler.source_and_edit',
                    'schedule': crontab(minute=minute,
                                     hour=hour,
                                     day_of_month=day_month,
                                     month_of_year=month,
                                     day_of_week=day_week),
                    'args': (flow.id,)
                }

            # Add a periodic task for checking and posting content
            celery_app.conf.beat_schedule['check_and_post_content'] = {
                'task': 'src.scheduler.scheduler.check_and_post_content',
                'schedule': crontab(minute='*/1'),  # Run every minute
                'args': ()
            }

        except Exception as e:
            error_msg = f"Error setting up periodic tasks: {str(e)}"
            self.error_manager.log_error(error_msg, {"context": "setup_periodic_tasks"})

    def update_source_config(self, source_id: int, parameters: dict):
        """Update source configuration dynamically."""
        try:
            source_config = self.db.query(SourceConfig).filter_by(id=source_id).first()
            if not source_config:
                raise ValueError(f"SourceConfig with ID {source_id} not found")

            # Validate and update source configuration
            validate_source_config_parameters(source_config.platform, parameters)
            source_config.parameters = parameters
            source_config.updated_at = datetime.now()
            self.db.commit()

        except Exception as e:
            self.error_manager.handle_error(
                e, {"context": "update_source_config", "source_id": source_id}
            )
