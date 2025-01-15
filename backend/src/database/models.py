from enum import Enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    JSON,
    ForeignKey,
    Boolean,
    Enum as SQLEnum,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.session import Base


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
    __tablename__ = "global_config"
    id = Column(Integer, primary_key=True)
    require_approval = Column(Boolean, default=True)
    error_logging_level = Column(String)
    config_data = Column(JSON)  # Stores platform-specific configurations
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    class Meta:
        app_label = "contentapp"


class SourceConfig(Base):
    __tablename__ = "source_configs"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    platform = Column(SQLEnum(Platform))
    credentials = Column(JSON)
    parameters = Column(JSON)  # Channel IDs, subreddits, etc.
    schedule_settings = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    class Meta:
        app_label = "contentapp"


class ContentFlow(Base):
    __tablename__ = "content_flows"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    source_config_id = Column(Integer, ForeignKey("source_configs.id"), index=True)
    editing_pipeline_id = Column(
        Integer, ForeignKey("editing_pipelines.id"), index=True
    )
    destination_account_id = Column(
        Integer, ForeignKey("destination_accounts.id"), index=True
    )
    quota_settings = Column(JSON)  # daily_limit, time_between_posts, blackout_periods
    schedule_settings = Column(JSON)  # sourcing_schedule, posting_schedule
    is_active = Column(Boolean, default=True)
    require_approval = Column(Boolean, default=True)

    source_config = relationship("SourceConfig")
    editing_pipeline = relationship("EditingPipeline")
    destination_account = relationship("DestinationAccount")

    # Add relationships to both queue and posted items
    queue_items = relationship("ContentQueueItem", back_populates="content_flow")
    posted_items = relationship("PostedItem", back_populates="content_flow")

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (Index("ix_content_flows_is_active", "is_active"),)

    class Meta:
        app_label = "contentapp"


class EditingPipeline(Base):
    __tablename__ = "editing_pipelines"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    transformation_config = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    class Meta:
        app_label = "contentapp"


class DestinationAccount(Base):
    __tablename__ = "destination_accounts"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    platform = Column(SQLEnum(Platform), nullable=False)
    credentials = Column(JSON, nullable=False, default={})
    parameters = Column(JSON, nullable=False, default={})
    schedule_settings = Column(JSON, nullable=False, default={})
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    class Meta:
        app_label = "contentapp"


class ContentQueueItem(Base):
    __tablename__ = "content_queue"
    id = Column(Integer, primary_key=True)
    source_platform = Column(SQLEnum(Platform))
    source_url = Column(String)
    source_data = Column(JSON)
    edited_content_path = Column(String, nullable=True)
    content_flow_id = Column(Integer, ForeignKey("content_flows.id"), index=True)
    preview_path = Column(String, nullable=True)
    status = Column(SQLEnum(ContentStatus))
    scheduled_time = Column(DateTime, nullable=True)
    error_log = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Add the relationship
    content_flow = relationship("ContentFlow", back_populates="queue_items")

    __table_args__ = (Index("ix_content_queue_status", "status"),)

    class Meta:
        app_label = "contentapp"


class ContentQuota(Base):
    __tablename__ = "content_quotas"
    id = Column(Integer, primary_key=True)
    source_platform = Column(SQLEnum(Platform))
    destination_account_id = Column(
        Integer, ForeignKey("destination_accounts.id"), index=True
    )
    max_daily_posts = Column(Integer)  # Max number of posts per day
    min_time_between_posts = Column(Integer)  # Minutes between posts
    content_ratio = Column(JSON)  # e.g., {"youtube": 0.7, "reddit": 0.3}
    blackout_periods = Column(JSON)  # e.g., [{"start": "23:00", "end": "07:00"}]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (Index("ix_content_quotas_is_active", "is_active"),)

    class Meta:
        app_label = "contentapp"


class PostedItem(Base):
    __tablename__ = "posted_items"
    id = Column(Integer, primary_key=True)
    original_queue_item_id = Column(Integer)
    content_flow_id = Column(Integer, ForeignKey("content_flows.id"), index=True)
    source_platform = Column(SQLEnum(Platform))
    source_url = Column(String)
    source_data = Column(JSON)  # Keep original source data for reference
    edited_content_path = Column(String)
    destination_platform = Column(SQLEnum(Platform))
    destination_account_id = Column(Integer, ForeignKey("destination_accounts.id"), index=True)
    posted_at = Column(DateTime, default=func.now())
    performance_metrics = Column(JSON, nullable=True)  # likes, views, etc.
    
    # Relationships
    content_flow = relationship("ContentFlow", back_populates="posted_items")
    destination_account = relationship("DestinationAccount")

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("ix_posted_items_content_flow_id", "content_flow_id"),
        Index("ix_posted_items_posted_at", "posted_at"),
    )

    class Meta:
        app_label = "contentapp"
