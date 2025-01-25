from pydantic import BaseModel, Field, HttpUrl, validator, ValidationError
from typing import Optional, Dict, Any, List, Union, Literal, TypedDict, ClassVar, Type, Tuple
from datetime import datetime
from zoneinfo import ZoneInfo
from .models import (
    Platform,
    ContentStatus,
    SourceType,
    SourceSelectionStrategy,
    ContentSelectionStrategy,
    ContentProcessingType,
)


# Base parameter schemas
class SourceTypeEnum(BaseModel):
    """Enum for source types"""
    enum: ClassVar[Type[SourceType]] = SourceType

class ContentSelectionStrategyEnum(BaseModel):
    """Enum for content selection strategies"""
    enum: ClassVar[Type[ContentSelectionStrategy]] = ContentSelectionStrategy

class ContentProcessingTypeEnum(BaseModel):
    """Enum for content processing types"""
    enum: ClassVar[Type[ContentProcessingType]] = ContentProcessingType


class BaseDiscoveryParameters(BaseModel):
    source_type: SourceType = Field(..., description="Type of content source to fetch from")
    selection_strategy: ContentSelectionStrategy = Field(
        default=ContentSelectionStrategy.MOST_RECENT,
        description="Strategy for selecting which content to process from a source"
    )
    max_items: int = Field(default=10, gt=0, le=100)


class BaseSourcingParameters(BaseModel):
    processing_type: ContentProcessingType = Field(
        default=ContentProcessingType.FULL,
        description="How to process the selected content"
    )
    output_format: str = "mp4"
    max_duration: Optional[int] = None


class YouTubeDiscoveryParameters(BaseDiscoveryParameters):
    source_type: Literal[SourceType.CHANNEL, SourceType.PLAYLIST, SourceType.VIDEO]
    channel_ids: Optional[List[str]] = Field(default_factory=list)
    playlist_ids: Optional[List[str]] = Field(default_factory=list)
    video_ids: Optional[List[str]] = Field(default_factory=list)
    source_selection_strategy: SourceSelectionStrategy = SourceSelectionStrategy.STATIC
    content_selection_strategy: ContentSelectionStrategy = ContentSelectionStrategy.NON_SELECTIVE


class YouTubeSourcingParameters(BaseSourcingParameters):
    start_time: Optional[int] = None
    end_time: Optional[int] = None
    quality: str = Field(default="1080p", pattern="^(360p|480p|720p|1080p)$")
    include_audio: bool = True


class RedditDiscoveryParameters(BaseDiscoveryParameters):
    source_type: Literal[SourceType.SUBREDDIT, SourceType.USER]
    subreddits: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_score: Optional[int] = Field(default=None, ge=0)
    include_nsfw: bool = False
    time_filter: str = Field(
        default="day",
        pattern="^(hour|day|week|month|year|all)$"
    )


class RedditSourcingParameters(BaseSourcingParameters):
    pass


class InstagramDiscoveryParameters(BaseDiscoveryParameters):
    source_type: Literal[SourceType.USER]
    hashtags: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_likes: Optional[int] = Field(default=None, ge=0)
    media_type: str = Field(
        default="video",
        pattern="^(image|video|carousel|all)$"
    )


class InstagramSourcingParameters(BaseSourcingParameters):
    pass


class TikTokDiscoveryParameters(BaseDiscoveryParameters):
    source_type: Literal[SourceType.TAG, SourceType.USER]
    tags: List[str] = Field(default_factory=list)
    users: List[str] = Field(default_factory=list)
    min_likes: Optional[int] = Field(default=None, ge=0)
    min_duration: Optional[int] = Field(default=None, ge=0)
    max_duration: Optional[int] = Field(default=None, ge=0)


class TikTokSourcingParameters(BaseSourcingParameters):
    pass


DiscoveryParameters = Union[
    YouTubeDiscoveryParameters,
    RedditDiscoveryParameters,
    InstagramDiscoveryParameters,
    TikTokDiscoveryParameters
]

SourcingParameters = Union[
    YouTubeSourcingParameters,
    RedditSourcingParameters,
    InstagramSourcingParameters,
    TikTokSourcingParameters
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
        from_attributes = True


# Source Config Schemas
class SourceConfigBase(BaseModel):
    name: str
    platform: Platform
    credentials: Dict[str, str]
    discovery_parameters: Union[
        BaseDiscoveryParameters,
        YouTubeDiscoveryParameters,
        RedditDiscoveryParameters,
        InstagramDiscoveryParameters,
        TikTokDiscoveryParameters
    ]
    sourcing_parameters: Union[
        BaseSourcingParameters,
        YouTubeSourcingParameters,
        RedditSourcingParameters,
        InstagramSourcingParameters,
        TikTokSourcingParameters
    ]
    rate_limit_id: Optional[int] = None

class SourceConfigCreate(SourceConfigBase):
    schedule_settings: Dict[str, Any]

class SourceConfig(SourceConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Editing Pipeline Schemas
class TransformationParameters(BaseModel):
    """Base parameters for transformations."""
    class Config:
        extra = "allow"  # Allow extra fields for different transformation types


class TransformationConfig(BaseModel):
    """Configuration for a single transformation."""
    parameters: Dict[str, Any] = Field(default_factory=dict)


class EditingPipelineBase(BaseModel):
    """Base schema for editing pipeline."""
    name: str
    transformation_config: Dict[str, Dict[str, TransformationConfig]] = Field(
        default_factory=dict,
        description="Map of transformation name to its config. Format: {'transformations': {'trim': {'parameters': {...}}}}"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "name": "YouTube Short Pipeline",
                "transformation_config": {
                    "transformations": {
                        "trim": {
                            "parameters": {
                                "start_time": 0,
                                "end_time": 60
                            }
                        },
                        "resize": {
                            "parameters": {
                                "width": 1080,
                                "height": 1920
                            }
                        }
                    }
                }
            }
        }


class EditingPipelineCreate(EditingPipelineBase):
    """Schema for creating a new editing pipeline."""
    pass


class EditingPipeline(EditingPipelineBase):
    """Schema for editing pipeline in database and responses."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EditingPipelineUpdate(BaseModel):
    """Schema for updating an existing editing pipeline."""
    name: Optional[str] = None
    transformation_config: Optional[Dict[str, Dict[str, TransformationConfig]]] = None


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
class PostSchedule(BaseModel):
    """Schema for content flow post schedule."""
    days: List[str] = Field(
        ...,  # required
        description="List of days when content can be posted",
        example=["monday", "wednesday", "friday"]
    )
    times: List[str] = Field(
        ...,  # required
        description="List of times when content can be posted (24h format)",
        example=["09:00", "15:00"]
    )
    timezone: str = Field(
        default="UTC",
        description="Timezone for the schedule"
    )

    @validator('days')
    def validate_days(cls, v):
        valid_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        days = [day.lower() for day in v]
        invalid_days = [day for day in days if day not in valid_days]
        if invalid_days:
            raise ValueError(f"Invalid days: {invalid_days}. Must be one of {valid_days}")
        return days

    @validator('times')
    def validate_times(cls, v):
        for time_str in v:
            try:
                hour, minute = map(int, time_str.split(":"))
                if not (0 <= hour <= 23 and 0 <= minute <= 59):
                    raise ValueError
            except ValueError:
                raise ValueError(f"Invalid time format: {time_str}. Must be in 24h format (HH:MM)")
        return v

    @validator('timezone')
    def validate_timezone(cls, v):
        try:
            ZoneInfo(v)
        except Exception:
            raise ValueError(f"Invalid timezone: {v}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "days": ["monday", "wednesday", "friday"],
                "times": ["09:00", "15:00"],
                "timezone": "Europe/London"
            }
        }

class ContentFlowBase(BaseModel):
    """Base schema for content flows."""
    name: str
    source_config_id: int
    editing_pipeline_id: int
    destination_account_id: int
    source_interval: Optional[int] = None
    post_schedule: Optional[PostSchedule] = None
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
    status: ContentStatus = ContentStatus.EDITING
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


# Global Config Schemas
class GlobalConfigBase(BaseModel):
    require_approval: bool = True
    enable_automatic_posting: bool = False

class GlobalConfigUpdate(GlobalConfigBase):
    pass

class GlobalConfig(GlobalConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Rate Limit Schemas
class RateLimitBase(BaseModel):
    name: str
    max_daily_actions: int
    min_time_between_actions: int
    blackout_periods: Dict[str, Any] = Field(default_factory=dict)

class SourceRateLimitCreate(RateLimitBase):
    pass

class SourceRateLimitUpdate(BaseModel):
    name: Optional[str] = None
    max_daily_actions: Optional[int] = None
    min_time_between_actions: Optional[int] = None
    blackout_periods: Optional[Dict[str, Any]] = None

class SourceRateLimit(RateLimitBase):
    id: int
    current_action_count: int = 0
    last_action_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DestinationRateLimitCreate(RateLimitBase):
    pass

class DestinationRateLimitUpdate(BaseModel):
    name: Optional[str] = None
    max_daily_actions: Optional[int] = None
    min_time_between_actions: Optional[int] = None
    blackout_periods: Optional[Dict[str, Any]] = None

class DestinationRateLimit(RateLimitBase):
    id: int
    current_action_count: int = 0
    last_action_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


def validate_source_config_parameters(
    platform: Platform,  # Change from str to Platform
    discovery_parameters: Dict[str, Any],
    sourcing_parameters: Dict[str, Any]
) -> Tuple[BaseDiscoveryParameters, BaseSourcingParameters]:
    """Validate and convert source configuration parameters based on platform.
    
    Args:
        platform: The platform value (e.g. Platform.YOUTUBE, Platform.REDDIT)
        discovery_parameters: Dictionary of discovery parameters to validate
        sourcing_parameters: Dictionary of sourcing parameters to validate
        
    Returns:
        Validated DiscoveryParameters object and SourcingParameters object
        
    Raises:
        ValueError: If parameters are invalid for the specified platform
    """
    platform_discovery_map = {
        Platform.YOUTUBE: YouTubeDiscoveryParameters,
        Platform.REDDIT: RedditDiscoveryParameters,
        Platform.INSTAGRAM: InstagramDiscoveryParameters,
        Platform.TIKTOK: TikTokDiscoveryParameters
    }
    
    platform_sourcing_map = {
        Platform.YOUTUBE: YouTubeSourcingParameters,
        Platform.REDDIT: RedditSourcingParameters,
        Platform.INSTAGRAM: InstagramSourcingParameters,
        Platform.TIKTOK: TikTokSourcingParameters
    }
    
    try:
        discovery_class = platform_discovery_map.get(platform, BaseDiscoveryParameters)
        sourcing_class = platform_sourcing_map.get(platform, BaseSourcingParameters)
        
        validated_discovery = discovery_class(**discovery_parameters)
        validated_sourcing = sourcing_class(**sourcing_parameters)
        
        return validated_discovery, validated_sourcing
    except ValidationError as e:
        raise ValueError(f"Invalid parameters for platform {platform}: {str(e)}")