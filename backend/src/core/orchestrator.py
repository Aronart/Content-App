from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging
from sqlalchemy.orm import Session
from pydantic import ValidationError

from database.models import (
    ContentStatus, Platform, Transformation, GlobalConfig, SourceConfig, 
    EditingPipeline, DestinationAccount, ContentQueueItem, ContentFlow
)
from source_adapters.registry import SourceRegistry
from editing.effects.registry import TransformationRegistry
from upload.platforms.registry import UploadRegistry
from editing.pipeline import EditingPipeline
from upload.queue_manager import QueueManager
from scheduler.scheduler import ContentScheduler
from error_handling.error_manager import ErrorManager
from database.schemas import validate_source_config_parameters
from editing.pipeline import TransformationPipeline


from django_celery_beat.models import PeriodicTask, ClockedSchedule, IntervalSchedule
import json

class ContentAppOrchestrator:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.error_manager = ErrorManager(logging_level="INFO")
        
        # Initialize the system
        self.initialize_system()
        self.setup_periodic_tasks()

        for flow in self.content_flows:
            schedule, created = ClockedSchedule.objects.get_or_create(clocked_time=flow.schedule_settings["souce_schedule"])
            PeriodicTask.objects.create(
                clocked=schedule,
                name=f"Run Content Flow {flow.id}",
                task='tasks.source_and_edit',
                args=json.dumps([flow.id])  # Pass flow ID as an argument
            )

        schedule, created = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.MINUTES
        )

        PeriodicTask.objects.create(
            interval=schedule,
            name="Check and Post Content",
            task="tasks.check_and_post_content"
        )
        
    def initialize_system(self):
        """Initialize all system components."""
        self.content_flows = self.db.query(ContentFlow).filter_by(is_active=True).all()
        print(f"Initialized with {len(self.content_flows)} active content flows.")

    def setup_periodic_tasks(self):
        """Set up periodic tasks for content flows and other scheduled activities."""
        try:
            # Set up tasks for each content flow
            for flow in self.content_flows:
                # Create clocked schedules for each flow
                schedule, created = ClockedSchedule.objects.get_or_create(
                    clocked_time=flow.schedule_settings["source_schedule"]
                )
                # Add periodic task
                task_name = f"Run Content Flow {flow.id}"
                if not PeriodicTask.objects.filter(name=task_name).exists():
                    PeriodicTask.objects.create(
                        clocked=schedule,
                        name=task_name,
                        task='celery_tasks.source_and_edit',  # Update to match your Celery task path
                        args=json.dumps([flow.id])  # Pass flow ID as an argument
                    )

            # Set up a global periodic task for posting content
            schedule, created = IntervalSchedule.objects.get_or_create(
                every=1,
                period=IntervalSchedule.MINUTES
            )
            task_name = "Check and Post Content"
            if not PeriodicTask.objects.filter(name=task_name).exists():
                PeriodicTask.objects.create(
                    interval=schedule,
                    name=task_name,
                    task="celery_tasks.check_and_post_content"  # Update to match your Celery task path
                )

            print("Periodic tasks set up successfully.")

        except Exception as e:
            print(f"Error setting up periodic tasks: {e}")

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
            self.error_manager.handle_error(e, {"context": "update_source_config", "source_id": source_id})