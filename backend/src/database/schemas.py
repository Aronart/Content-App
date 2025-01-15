from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List, Union, Literal
from datetime import datetime
from enum import Enum
from .models import Platform, ContentStatus


class SourceType(str, Enum):
    CHANNEL = "channel"
    PLAYLIST = "playlist"
    VIDEO = "video"
    SUBREDDIT = "subreddit"
    USER = "user"
    HASHTAG = "hashtag"
    TAG = "tag"


class ContentSelectionStrategy(str, Enum):
    MOST_VIEWED = "most_viewed"
    MOST_RECENT = "most_recent"
    TRENDING = "trending"
    RANDOM = "random"
    CUSTOM = "custom"


class BaseSourceParameters(BaseModel):
    source_type: SourceType
    selection_strategy: ContentSelectionStrategy = ContentSelectionStrategy.MOST_RECENT
    max_items: int = Field(default=10, gt=0, le=100)


class YouTubeParameters(BaseSourceParameters):
    source_type: Literal[SourceType.CHANNEL, SourceType.PLAYLIST, SourceType.VIDEO]
    channel_ids: Optional[List[str]] = Field(default_factory=list)
    playlist_ids: Optional[List[str]] = Field(default_factory=list)
    video_ids: Optional[List[str]] = Field(default_factory=list)
    max_videos_per_channel: Optional[int] = Field(default=5, gt=0, le=50)
    min_duration: Optional[int] = Field(default=None, ge=0)  # in seconds
    max_duration: Optional[int] = Field(default=None, ge=0)  # in seconds
    category: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "source_type": "channel",
                "selection_strategy": "most_viewed",
                "max_items": 50,
                "channel_ids": ["UC..."],
                "max_videos_per_channel": 10,
                "min_duration": 300,
                "max_duration": 900,
            }
        }


class RedditParameters(BaseSourceParameters):
    source_type: Literal[SourceType.SUBREDDIT, SourceType.USER]
    subreddits: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_score: Optional[int] = Field(default=None, ge=0)
    include_nsfw: bool = False
    time_filter: str = Field(
        default="day",
        pattern="^(hour|day|week|month|year|all)$"
    )

    class Config:
        schema_extra = {
            "example": {
                "source_type": "subreddit",
                "selection_strategy": "trending",
                "max_items": 25,
                "subreddits": ["videos", "gaming"],
                "min_score": 1000,
                "time_filter": "week"
            }
        }


class InstagramParameters(BaseSourceParameters):
    source_type: Literal[SourceType.HASHTAG, SourceType.USER]
    hashtags: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_likes: Optional[int] = Field(default=None, ge=0)
    media_type: str = Field(
        default="video",
        pattern="^(image|video|carousel|all)$"
    )

    class Config:
        schema_extra = {
            "example": {
                "source_type": "hashtag",
                "selection_strategy": "trending",
                "max_items": 30,
                "hashtags": ["gaming", "funny"],
                "min_likes": 5000,
                "media_type": "video"
            }
        }


class TikTokParameters(BaseSourceParameters):
    source_type: Literal[SourceType.TAG, SourceType.USER]
    tags: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_likes: Optional[int] = Field(default=None, ge=0)
    min_duration: Optional[int] = Field(default=None, ge=0)  # in seconds
    max_duration: Optional[int] = Field(default=None, ge=0)  # in seconds

    class Config:
        schema_extra = {
            "example": {
                "source_type": "tag",
                "selection_strategy": "trending",
                "max_items": 20,
                "tags": ["fyp", "gaming"],
                "min_likes": 10000,
                "min_duration": 15,
                "max_duration": 60
            }
        }


SourceParameters = Union[
    YouTubeParameters,
    RedditParameters,
    InstagramParameters,
    TikTokParameters
]


class ContentQueueItemResponse(BaseModel):
    id: int
    source_platform: str
    source_url: str
    source_data: Dict[str, Any]
    edited_content_path: Optional[str]
    content_flow_id: int
    preview_path: Optional[str]
    status: str
    scheduled_time: Optional[datetime]
    error_log: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Source Config Schemas
class SourceConfigBase(BaseModel):
    name: str
    platform: Platform
    credentials: Dict[str, str]
    parameters: Dict[str, Any]

class SourceConfigCreate(SourceConfigBase):
    schedule_settings: Dict[str, Any]

class SourceConfig(SourceConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Editing Pipeline Schemas
class EditingPipelineBase(BaseModel):
    name: str
    transformation_config: Dict[str, Any]

class EditingPipelineCreate(EditingPipelineBase):
    pass

class EditingPipeline(EditingPipelineBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Destination Account Schemas
class DestinationAccountBase(BaseModel):
    name: str
    platform: Platform
    credentials: Dict[str, str]
    parameters: Dict[str, Any]

class DestinationAccountCreate(DestinationAccountBase):
    schedule_settings: Dict[str, Any]

class DestinationAccount(DestinationAccountBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Content Flow Schemas
class ContentFlowBase(BaseModel):
    name: str
    source_config_id: int
    editing_pipeline_id: int
    destination_account_id: int
    quota_settings: Dict[str, Any]
    schedule_settings: Dict[str, Any]
    is_active: bool = True
    require_approval: bool = True

class ContentFlowCreate(ContentFlowBase):
    pass

class ContentFlow(ContentFlowBase):
    id: int
    created_at: datetime
    updated_at: datetime
    source_config: SourceConfig
    editing_pipeline: EditingPipeline
    destination_account: DestinationAccount

    class Config:
        from_attributes = True

# Content Queue Schemas
class ContentQueueBase(BaseModel):
    source_platform: Platform
    source_url: str
    source_data: Dict[str, Any]
    edited_content_path: Optional[str] = None
    content_flow_id: int
    preview_path: Optional[str] = None
    status: ContentStatus = ContentStatus.PENDING
    scheduled_time: Optional[datetime] = None
    error_log: Optional[Dict[str, Any]] = None

class ContentQueueCreate(ContentQueueBase):
    pass

class ContentQueue(ContentQueueBase):
    id: int
    created_at: datetime
    updated_at: datetime
    content_flow: ContentFlow

    class Config:
        from_attributes = True

# Content Quota Schemas
class ContentQuotaBase(BaseModel):
    source_platform: Platform
    destination_account_id: int
    max_daily_posts: int
    min_time_between_posts: int
    content_ratio: Dict[str, Any]
    blackout_periods: Dict[str, Any]
    is_active: bool = True

class ContentQuotaCreate(ContentQuotaBase):
    pass

class ContentQuota(ContentQuotaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


def validate_source_config_parameters(platform: str, parameters: dict) -> SourceParameters:
    """Validate and convert source configuration parameters based on platform.
    
    Args:
        platform: The platform value (e.g. "youtube", "reddit")
        parameters: Dictionary of parameters to validate
        
    Returns:
        Validated SourceParameters object
        
    Raises:
        ValueError: If parameters are invalid for the specified platform
    """
    try:
        if platform == Platform.YOUTUBE.value:
            return YouTubeParameters(**parameters)
        elif platform == Platform.REDDIT.value:
            return RedditParameters(**parameters)
        elif platform == Platform.INSTAGRAM.value:
            return InstagramParameters(**parameters)
        elif platform == Platform.TIKTOK.value:
            return TikTokParameters(**parameters)
        else:
            raise ValueError(f"Unsupported platform: {platform}")
    except Exception as e:
        raise ValueError(f"Invalid parameters for platform {platform}: {str(e)}")
