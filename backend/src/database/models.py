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
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database.session import Base


class Platform(str, Enum):
    """Supported platforms for content."""
    YOUTUBE = "youtube"
    REDDIT = "reddit"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"


class ContentStatus(str, Enum):
    """Status of content in the processing pipeline."""
    EDITING = "editing"
    READY = "ready"
    APPROVED = "approved"
    POSTING = "posting"
    COMPLETED = "completed"
    EDITING_ERROR = "editing_error"
    POSTING_ERROR = "posting_error"


class SourceType(str, Enum):
    """Type of content source to fetch from."""
    CHANNEL = "channel"
    PLAYLIST = "playlist"
    VIDEO = "video"
    SUBREDDIT = "subreddit"
    USER = "user"
    TAG = "tag"


class SourceSelectionStrategy(str, Enum):
    """Strategy for selecting which sources to use."""
    STATIC = "static"  # Use explicitly provided sources
    UNDERRATED = "underrated"  # Find underrated content


class ContentSelectionStrategy(str, Enum):
    """Strategy for selecting which content to process from a source."""
    MOST_VIEWED = "most_viewed"
    MOST_RECENT = "most_recent"
    TRENDING = "trending"
    RANDOM = "random"
    NON_SELECTIVE = "non_selective"


class ContentProcessingType(str, Enum):
    """How to process the selected content."""
    COMBINE = "combine"  # Combine multiple pieces of content
    FULL = "full"  # Use the full content
    MOST_REPLAYED = "most_replayed"  # Extract most replayed segments


class Transformation(str, Enum):
    """Types of content transformations."""
    COMBINE = "combine"
    TRIM = "trim"
    SUBTITLES = "subtitles"
    RESIZE = "resize"
    ADD_OVERLAY = "overlay"
    ADJUST_SPEED = "speed"
    ADD_TRANSITION = "transition"


class GlobalConfig(Base):
    __tablename__ = "global_config"
    id = Column(Integer, primary_key=True)
    require_approval = Column(Boolean, default=True)
    enable_automatic_posting = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    class Meta:
        app_label = "contentapp"


class SourceRateLimit(Base):
    """Rate limits for content sourcing (e.g., API rate limits for fetching content)."""
    __tablename__ = "source_rate_limits"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    current_action_count = Column(Integer, default=0)
    max_daily_actions = Column(Integer)
    last_action_at = Column(DateTime, nullable=True)
    min_time_between_actions = Column(Integer)
    blackout_periods = Column(JSON)  # Time periods when fetching is not allowed
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    source_configs = relationship("SourceConfig", back_populates="rate_limit")

    class Meta:
        app_label = "contentapp"


class DestinationRateLimit(Base):
    """Rate limits for content posting (e.g., platform limits for posting content)."""
    __tablename__ = "destination_rate_limits"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    current_action_count = Column(Integer, default=0)
    max_daily_actions = Column(Integer)
    last_action_at = Column(DateTime, nullable=True)
    min_time_between_actions = Column(Integer)
    blackout_periods = Column(JSON)  # Time periods when posting is not allowed
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    destination_accounts = relationship("DestinationAccount", back_populates="rate_limit")

    class Meta:
        app_label = "contentapp"


class SourceConfig(Base):
    __tablename__ = "source_configs"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    platform = Column(SQLEnum(Platform), nullable=False)
    credentials = Column(JSON, nullable=False, default={})
    discovery_parameters = Column(JSON, nullable=False, default={})  # How to find content
    sourcing_parameters = Column(JSON, nullable=False, default={})   # How to process found content
    rate_limit_id = Column(Integer, ForeignKey("source_rate_limits.id"), index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    rate_limit = relationship("SourceRateLimit", back_populates="source_configs")
    content_flows = relationship("ContentFlow", back_populates="source_config")

    class Meta:
        app_label = "contentapp"


class ContentFlow(Base):
    __tablename__ = "content_flows"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    source_config_id = Column(Integer, ForeignKey("source_configs.id"), nullable=False)
    editing_pipeline_id = Column(Integer, ForeignKey("editing_pipelines.id"), nullable=False)
    destination_account_id = Column(Integer, ForeignKey("destination_accounts.id"), nullable=False)
    source_interval = Column(Integer)
    post_schedule = Column(JSON)
    is_active = Column(Boolean, default=True)
    require_approval = Column(Boolean, default=True)

    # Relationships
    source_config = relationship("SourceConfig", back_populates="content_flows")
    editing_pipeline = relationship("EditingPipeline", back_populates="content_flows")
    destination_account = relationship("DestinationAccount", back_populates="content_flows")
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
    name = Column(String, nullable=False, unique=True)
    transformations = Column(JSON, nullable=False, default=[])
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    content_flows = relationship("ContentFlow", back_populates="editing_pipeline")

    class Meta:
        app_label = "contentapp"


class DestinationAccount(Base):
    """Destination platform account for posting content."""
    __tablename__ = "destination_accounts"
    id = Column(Integer, primary_key=True)
    platform = Column(SQLEnum(Platform), nullable=False)
    name = Column(String, nullable=False, unique=True)  # Display name for the account
    credentials = Column(JSON, nullable=False)  # OAuth tokens, API keys, etc.
    rate_limit_id = Column(Integer, ForeignKey("destination_rate_limits.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    rate_limit = relationship("DestinationRateLimit", back_populates="destination_accounts")
    content_flows = relationship("ContentFlow", back_populates="destination_account")

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
    error_log = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    content_flow = relationship("ContentFlow", back_populates="queue_items")

    __table_args__ = (Index("ix_content_queue_status", "status"),)

    class Meta:
        app_label = "contentapp"


class PostedItem(Base):
    __tablename__ = "posted_items"
    id = Column(Integer, primary_key=True)
    content_flow_id = Column(Integer, ForeignKey("content_flows.id"), nullable=False)
    source_platform = Column(SQLEnum(Platform))
    source_url = Column(String)  # Original source URL
    source_data = Column(JSON)  # Original source data
    edited_content_path = Column(String)  # Path to edited content
    external_id = Column(String)  # Platform post ID
    performance_metrics = Column(JSON, nullable=True)  # likes, views, etc.
    posted_at = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    content_flow = relationship("ContentFlow", back_populates="posted_items")

    class Meta:
        app_label = "contentapp"
