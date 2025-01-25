"""Type definitions for editing pipeline."""
from typing import Dict, Any, List, TypedDict, Optional
from enum import Enum


class TransformationType(str, Enum):
    """Types of transformations that can be applied to content."""
    TRIM = "trim"              # Cut video to specific length
    COMBINE = "combine"        # Combine multiple videos
    RESIZE = "resize"          # Change video dimensions
    ADD_SUBTITLES = "subtitles"  # Add subtitles to video
    ADD_OVERLAY = "overlay"    # Add text/image overlay
    ADJUST_SPEED = "speed"     # Change playback speed
    ADD_TRANSITION = "transition"  # Add transition effects


class TransformationConfig(TypedDict):
    """Configuration for a single transformation step."""
    type: TransformationType
    params: Dict[str, Any]


class PipelineConfig(TypedDict):
    """Configuration for the entire transformation pipeline."""
    steps: List[TransformationConfig]
    output_format: str
    output_quality: str


class EditedContent(TypedDict):
    """Result of processing content through the pipeline."""
    file_path: str
    duration: float
    width: int
    height: int
    format: str
    transformations_applied: List[str]
    original_content: Dict[str, Any]  # Reference to original content
