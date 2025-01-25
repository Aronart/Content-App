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
from src.logging.log_manager import LogManager, LogLevel
from src.database.schemas import validate_source_config_parameters
from config import Settings

settings = Settings()

# Initialize Celery
celery_app = Celery('content_app')

class ContentAppOrchestrator:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.log_manager = LogManager()
        self.logger_name = "orchestrator"

        self.initialize_system()

    def initialize_system(self):
        """Initialize all system components."""
        # Ensure single GlobalConfig
        self._ensure_single_global_config()
        
        content_flows = self.db.query(ContentFlow).filter_by(is_active=True).all()
        self.log_manager.info(
            self.logger_name,
            f"Content App found {len(content_flows)} active content flows"
        )
        self.setup_periodic_tasks()

    def _ensure_single_global_config(self):
        """Ensure there is exactly one GlobalConfig entry."""
        configs = self.db.query(GlobalConfig).all()
        
        # If exactly one config exists, do nothing
        if len(configs) == 1:
            return
            
        # If multiple configs exist, delete them all
        if len(configs) > 1:
            for config in configs:
                self.db.delete(config)
            self.db.commit()
            self.log_manager.info(
                self.logger_name,
                f"Removed {len(configs)} duplicate GlobalConfig entries"
            )
        
        # Create one with defaults
        default_config = GlobalConfig(
            require_approval=True,
            enable_automatic_posting=False
        )
        self.db.add(default_config)
        self.db.commit()
        self.log_manager.info(
            self.logger_name,
            "Created new GlobalConfig entry with default values"
        )

    def setup_periodic_tasks(self):
        try:
            # Single task to process all content flows
            celery_app.conf.beat_schedule['process_all_flows'] = {
                'task': 'src.scheduler.scheduler.process_all_flows',
                'schedule': crontab(minute=f'*/{settings.TASK_INTERVAL}'),
                'args': ()
            }

            # Task for checking and posting content
            celery_app.conf.beat_schedule['check_and_post_content'] = {
                'task': 'src.scheduler.scheduler.check_and_post_content',
                'schedule': crontab(minute=f'*/{settings.TASK_INTERVAL}'),
                'args': ()
            }

        except Exception as e:
            error_msg = f"Error setting up periodic tasks: {str(e)}"
            self.log_manager.error(self.logger_name, error_msg, {"context": "setup_periodic_tasks"})
