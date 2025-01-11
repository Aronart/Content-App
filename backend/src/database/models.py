from enum import Enum
from sqlalchemy import (
    Column, Integer, String, DateTime, JSON, ForeignKey, Boolean, Enum as SQLEnum, Index
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Platform(Enum):
    YOUTUBE = "youtube"
    REDDIT = "reddit"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"

class Transformation(Enum):
    COMBINE = "combine"
    TRIM = "trim"
    SUBTITLES = "subtitles"

class ContentStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class GlobalConfig(Base):
    __tablename__ = 'global_config'
    id = Column(Integer, primary_key=True)
    require_approval = Column(Boolean, default=True)
    error_logging_level = Column(String)
    config_data = Column(JSON)  # Stores platform-specific configurations
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class SourceConfig(Base):
    __tablename__ = 'source_configs'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    platform = Column(SQLEnum(Platform))
    credentials = Column(JSON)
    parameters = Column(JSON)  # Channel IDs, subreddits, etc.
    schedule_settings = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ContentFlow(Base):
    __tablename__ = 'content_flows'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    source_config_id = Column(Integer, ForeignKey('source_configs.id'), index=True)
    editing_pipeline_id = Column(Integer, ForeignKey('editing_pipelines.id'), index=True)
    destination_account_id = Column(Integer, ForeignKey('destination_accounts.id'), index=True)
    quota_settings = Column(JSON)  # daily_limit, time_between_posts, blackout_periods
    schedule_settings = Column(JSON)  # sourcing_schedule, posting_schedule #schedule_settings["souce_schedule"]
    is_active = Column(Boolean, default=True)
    
    source_config = relationship("SourceConfig")
    editing_pipeline = relationship("EditingPipeline")
    destination_account = relationship("DestinationAccount")
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (Index('ix_content_flows_is_active', 'is_active'),)

class EditingPipeline(Base):
    __tablename__ = 'editing_pipelines'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    transformation_config = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class DestinationAccount(Base):
    __tablename__ = 'destination_accounts'
    id = Column(Integer, primary_key=True)
    platform = Column(SQLEnum(Platform))
    account_name = Column(String)
    credentials = Column(JSON)
    schedule_settings = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ContentQueueItem(Base):
    __tablename__ = 'content_queue'
    id = Column(Integer, primary_key=True)
    source_platform = Column(SQLEnum(Platform))
    source_url = Column(String)
    source_data = Column(JSON)
    edited_content_path = Column(String, nullable=True)
    content_flow_id = Column(Integer, ForeignKey('content_flows.id'), index=True)
    preview_path = Column(String, nullable=True)
    status = Column(SQLEnum(ContentStatus))
    scheduled_time = Column(DateTime, nullable=True)
    error_log = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (Index('ix_content_queue_status', 'status'),)

class ContentQuota(Base):
    __tablename__ = 'content_quotas'
    id = Column(Integer, primary_key=True)
    source_platform = Column(SQLEnum(Platform))
    destination_account_id = Column(Integer, ForeignKey('destination_accounts.id'), index=True)
    max_daily_posts = Column(Integer)  # Max number of posts per day
    min_time_between_posts = Column(Integer)  # Minutes between posts
    content_ratio = Column(JSON)  # e.g., {"youtube": 0.7, "reddit": 0.3}
    blackout_periods = Column(JSON)  # e.g., [{"start": "23:00", "end": "07:00"}]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (Index('ix_content_quotas_is_active', 'is_active'),)
