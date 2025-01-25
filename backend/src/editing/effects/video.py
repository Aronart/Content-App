from typing import Dict, Any, List, Tuple
import ffmpeg
import numpy as np
import cv2
import pytesseract
from src.database.models import Transformation
from src.editing.effects.base import Transformation as TransformationBase, TransformationError
from src.editing.effects.registry import TransformationRegistry
from src.logging.log_manager import LogManager

log_manager = LogManager()
logger_name = "video-transformations"


@TransformationRegistry.register(Transformation.TRIM)
class TrimTransformation(TransformationBase):
    """Trim video to specified start and end times."""
    
    def apply(self, content_items: List[Dict[str, Any]], parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Apply trim transformation to each content item.
        
        Args:
            content_items: List of content objects to trim
            parameters: Must contain:
                - start_time: Start time in seconds
                - end_time: End time in seconds
                
        Returns:
            List of trimmed content objects
            
        Raises:
            TransformationError: If trim fails
        """
        try:
            start_time = parameters.get("start_time", 0)
            end_time = parameters.get("end_time")
            
            if end_time is None:
                log_manager.error(
                    logger_name,
                    "Missing end_time parameter",
                    context={"parameters": parameters}
                )
                raise TransformationError("end_time parameter is required for trim")
            
            trimmed_items = []
            for content in content_items:
                # Build ffmpeg command
                input_path = content["file_path"]
                output_path = self._get_output_path(input_path, "_trimmed")
                
                stream = ffmpeg.input(input_path, ss=start_time, t=end_time-start_time)
                self._run_ffmpeg(stream, output_path)
                
                # Update content object
                trimmed_content = content.copy()
                trimmed_content["file_path"] = output_path
                trimmed_content["duration"] = end_time - start_time
                trimmed_content["trim_info"] = {
                    "original_duration": content.get("duration"),
                    "start_time": start_time,
                    "end_time": end_time
                }
                
                trimmed_items.append(trimmed_content)
            
            return trimmed_items
            
        except Exception as e:
            log_manager.error(
                logger_name,
                "Failed to trim videos",
                context={"content_count": len(content_items)},
                error=e
            )
            raise TransformationError(f"Trim failed: {str(e)}") from e


@TransformationRegistry.register(Transformation.SUBTITLES)
class SubtitleTransformation(TransformationBase):
    """Add subtitles to video using speech recognition."""
    
    def apply(self, content_items: List[Dict[str, Any]], parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Apply subtitle transformation to each content item.
        
        Args:
            content_items: List of content objects to add subtitles to
            parameters: May contain:
                - language: Target language (default: "en")
                - model_size: Whisper model size (default: "large")
                - font_size: Subtitle font size (default: 24)
                - font_color: Subtitle color (default: "white")
                - force_subtitles: Force subtitle generation even if burned-in subtitles detected
                
        Returns:
            List of content objects with subtitles
            
        Raises:
            TransformationError: If subtitle generation fails
        """
        try:
            language = parameters.get("language", "en")
            model_size = parameters.get("model_size", "large")
            font_size = parameters.get("font_size", 24)
            font_color = parameters.get("font_color", "white")
            force_subtitles = parameters.get("force_subtitles", False)
            
            subtitled_items = []
            for content in content_items:
                input_path = content["file_path"]
                
                # Check for burned-in subtitles
                if not force_subtitles:
                    has_subtitles = self._detect_burned_subtitles(input_path)
                    if has_subtitles:
                        log_manager.info(
                            logger_name,
                            "Burned-in subtitles detected, skipping subtitle generation",
                            context={"input_path": input_path}
                        )
                        subtitled_content = content.copy()
                        subtitled_content["subtitle_info"] = {"has_burned_subtitles": True}
                        subtitled_items.append(subtitled_content)
                        continue
                
                # Generate subtitles using Whisper
                log_manager.info(
                    logger_name,
                    "Generating subtitles using Whisper AI",
                    context={"model_size": model_size, "language": language}
                )
                
                # Extract audio
                audio_path = self._get_output_path(input_path, "_audio.wav")
                stream = ffmpeg.input(input_path)
                stream = ffmpeg.output(stream, audio_path, acodec="pcm_s16le", ac=1, ar="16k")
                self._run_ffmpeg(stream, audio_path)
                
                # Generate subtitles
                import whisper
                from datetime import timedelta
                
                model = whisper.load_model(model_size)
                result = model.transcribe(
                    audio_path,
                    language=language,
                    task="transcribe"
                )
                
                # Create SRT file
                srt_path = self._get_output_path(input_path, ".srt")
                with open(srt_path, "w", encoding="utf-8") as f:
                    for i, segment in enumerate(result["segments"], 1):
                        start = str(timedelta(seconds=segment["start"])).replace(".", ",")[:12]
                        end = str(timedelta(seconds=segment["end"])).replace(".", ",")[:12]
                        f.write(f"{i}\n")
                        f.write(f"{start} --> {end}\n")
                        f.write(f"{segment['text'].strip()}\n\n")
                
                # Add subtitles to video
                output_path = self._get_output_path(input_path, "_subtitled")
                subtitle_filter = f"subtitles={srt_path}:force_style='FontSize={font_size},PrimaryColour={font_color}'"
                
                stream = ffmpeg.input(input_path)
                stream = ffmpeg.filter(stream, "subtitles", srt_path)
                self._run_ffmpeg(stream, output_path)
                
                # Update content object
                subtitled_content = content.copy()
                subtitled_content["file_path"] = output_path
                subtitled_content["subtitle_info"] = {
                    "language": language,
                    "srt_path": srt_path,
                    "generated_by": "whisper",
                    "model_size": model_size
                }
                
                subtitled_items.append(subtitled_content)
            
            return subtitled_items
            
        except Exception as e:
            log_manager.error(
                logger_name,
                "Failed to add subtitles",
                context={"content_count": len(content_items)},
                error=e
            )
            raise TransformationError(f"Subtitle generation failed: {str(e)}") from e


@TransformationRegistry.register(Transformation.COMBINE)
class CombineVideos(TransformationBase):
    """Combine multiple videos into one."""
    
    def apply(self, content_items: List[Dict[str, Any]], parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Combine multiple videos into one.
        
        Args:
            content_items: List of content objects to combine
            parameters: May contain:
                - transition: Transition effect (default: None)
                - max_videos: Maximum number of videos to combine (default: all)
                
        Returns:
            List containing single combined content object
            
        Raises:
            TransformationError: If combination fails
        """
        try:
            if len(content_items) < 2:
                log_manager.info(
                    logger_name,
                    "Not enough videos to combine",
                    context={"video_count": len(content_items)}
                )
                return content_items
            
            max_videos = parameters.get("max_videos", len(content_items))
            transition = parameters.get("transition")
            
            # Prepare input files
            items_to_combine = content_items[:max_videos]
            input_files = [item["file_path"] for item in items_to_combine]
            
            # Create file list for ffmpeg
            list_path = self._get_output_path(input_files[0], "_list.txt")
            with open(list_path, "w") as f:
                for file_path in input_files:
                    f.write(f"file '{file_path}'\n")
            
            # Build ffmpeg command
            output_path = self._get_output_path(input_files[0], "_combined")
            
            if transition:
                # Complex command with transition effects
                inputs = []
                filters = []
                for i, file in enumerate(input_files):
                    inputs.extend(["-i", file])
                    if i > 0:
                        filters.append(f"[{i-1}:v][{i}:v]xfade=transition={transition}:duration=1[v{i}]")
                
                stream = (
                    ffmpeg
                    .input(list_path, format="concat", safe=0)
                    .output(output_path, filter_complex="".join(filters))
                )
            else:
                # Simple concatenation
                stream = (
                    ffmpeg
                    .input(list_path, format="concat", safe=0)
                    .output(output_path, c="copy")
                )
            
            # Run ffmpeg
            self._run_ffmpeg(stream, output_path)
            
            # Create new content object for combined video
            combined_content = {
                "file_path": output_path,
                "platform": items_to_combine[0]["platform"],
                "title": f"Combined: {items_to_combine[0]['title']}",
                "description": "Combined from multiple videos:\n" + "\n".join(
                    f"- {item['title']}" for item in items_to_combine
                ),
                "duration": sum(item.get("duration", 0) for item in items_to_combine),
                "url": items_to_combine[0]["url"],  # Use first video's URL as primary
                "combined_from": [{
                    "url": item["url"],
                    "title": item["title"],
                    "duration": item.get("duration")
                } for item in items_to_combine]
            }
            
            # Return list with single combined item
            return [combined_content]
            
        except Exception as e:
            log_manager.error(
                logger_name,
                "Failed to combine videos",
                context={"video_count": len(content_items)},
                error=e
            )
            raise TransformationError(f"Video combination failed: {str(e)}") from e
