"""Type definitions for source adapters."""
from typing import Dict, Any, Optional, TypedDict


class VideoMetadata(TypedDict):
    """Metadata for a video from any platform.
    
    This is an intermediate data structure used during content discovery
    before the content is processed and downloaded.
    """
    platform: str
    video_id: str
    url: str
    title: str
    description: str
    thumbnail: str
    published_at: str
    most_replayed_data: Optional[Dict[str, Any]]


class ProcessedVideo(TypedDict):
    """Video that has been processed and downloaded.
    
    This represents the final output of a source adapter after
    content has been discovered, downloaded, and processed.
    """
    file_path: str
    duration: float
    video_id: str
    title: str
    description: str
    thumbnail: str
    published_at: str
    url: str
    platform: str
