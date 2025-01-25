from abc import ABC, abstractmethod
import ffmpeg
from typing import Dict, Any, Optional, List
import os
from src.logging.log_manager import LogManager, LogLevel

log_manager = LogManager()
logger_name = "transformation-base"


class TransformationError(Exception):
    """Base exception for transformation errors."""
    pass


class Transformation(ABC):
    """Base class for all video transformations."""
    
    def __init__(self, parameters: Optional[Dict[str, Any]] = None):
        """Initialize transformation with parameters.
        
        Args:
            parameters: Optional parameters for the transformation
        """
        self.parameters = parameters or {}
    
    @abstractmethod
    def apply(self, content_items: List[Dict[str, Any]], parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Apply the transformation to the content items.
        
        Args:
            content_items: List of content objects, each containing file_path and metadata
            parameters: Parameters for the transformation
            
        Returns:
            List of modified content objects. May be shorter than input list if items were combined.
            
        Raises:
            TransformationError: If transformation fails
        """
        pass
    
    def _get_output_path(self, input_path: str, suffix: str = "") -> str:
        """Generate output path for transformed file.
        
        Args:
            input_path: Original file path
            suffix: Optional suffix to add to filename
            
        Returns:
            Path for output file
        """
        directory = os.path.dirname(input_path)
        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)
        return os.path.join(directory, f"{name}{suffix}{ext}")
    
    def _run_ffmpeg(self, stream: Any, output_path: str) -> None:
        """Run ffmpeg command and handle errors.
        
        Args:
            stream: Configured ffmpeg stream from ffmpeg-python
            output_path: Where to save the output
            
        Raises:
            TransformationError: If ffmpeg fails
        """
        try:
            log_manager.info(
                logger_name,
                "Running FFmpeg command",
                context={"output_path": output_path}
            )
            stream.output(output_path).overwrite_output().run(capture_stdout=True, capture_stderr=True)
            
        except ffmpeg.Error as e:
            error_message = e.stderr.decode() if e.stderr else str(e)
            log_manager.error(
                logger_name,
                "FFmpeg command failed",
                context={"output_path": output_path},
                error=e
            )
            raise TransformationError(f"FFmpeg failed: {error_message}") from e
