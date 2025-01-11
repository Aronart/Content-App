from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
from models import Platform

# Define Pydantic Models for Platform-Specific Parameters
class YouTubeParameters(BaseModel):
    channel_ids: List[str] = []
    playlist_ids: List[str] = []

class RedditParameters(BaseModel):
    subreddits: List[str] = []
    users: List[str] = []

class InstagramParameters(BaseModel):
    hashtags: List[str] = []

class TikTokParameters(BaseModel):
    tags: List[str] = []

# Validator for platform-specific configurations
def validate_source_config_parameters(platform: str, parameters: dict):
    if platform == Platform.YOUTUBE.value:
        if "channel_ids" in parameters:
            YouTubeParameters(channel_ids=parameters.get("channel_ids"))
        if "playlist_ids" in parameters:
            YouTubeParameters(playlist_ids=parameters.get("playlist_ids"))
    elif platform == Platform.REDDIT.value:
        if "subreddits" in parameters:
            RedditParameters(subreddits=parameters.get("subreddits"))
        if "users" in parameters:
            RedditParameters(users=parameters.get("users"))
    elif platform == Platform.INSTAGRAM.value:
        if "hashtags" in parameters:
            InstagramParameters(hashtags=parameters.get("hashtags"))
    elif platform == Platform.TIKTOK.value:
        if "tags" in parameters:
            TikTokParameters(tags=parameters.get("tags"))
    else:
        raise ValueError(f"Unsupported platform: {platform}")