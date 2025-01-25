from typing import Dict, Any, List, Optional
import requests
import re
import json
from bs4 import BeautifulSoup
import yt_dlp
from googleapiclient.errors import HttpError
from src.source_adapters.base import SourceAdapter
from src.source_adapters.types import VideoMetadata, ProcessedVideo
from src.database.schemas import (
    YouTubeDiscoveryParameters,
    YouTubeSourcingParameters,
    SourceType,
    ContentSelectionStrategy,
    ContentProcessingType,
    SourceSelectionStrategy,
)
from src.source_adapters.registry import SourceRegistry
from src.database.models import Platform, PostedItem
from src.database.session import SessionLocal
from isodate import parse_duration
from src.logging.log_manager import LogManager
import os

logger_name = "youtube-adapter"
log_manager = LogManager()


class YouTubeError(Exception):
    """Base exception for YouTube adapter errors."""
    pass

class YouTubeAPIError(YouTubeError):
    """Raised when there's an error with YouTube API operations."""
    pass

class YouTubeContentError(YouTubeError):
    """Raised when there's an error processing or downloading content."""
    pass


@SourceRegistry.register(Platform.YOUTUBE)
class YouTubeAdapter(SourceAdapter):
    def __init__(
        self,
        content_flow_id: int,
        credentials: str,
        discovery_parameters: YouTubeDiscoveryParameters,
        sourcing_parameters: YouTubeSourcingParameters
    ):
        self.content_flow_id = content_flow_id
        self.discovery_parameters: YouTubeDiscoveryParameters = discovery_parameters
        self.sourcing_parameters: YouTubeSourcingParameters = sourcing_parameters
        self.api = self._init_api(credentials)

    def _init_api(self, credentials: str):
        """Initialize the YouTube API client.
        
        Args:
            credentials: YouTube API key
            
        Returns:
            Initialized YouTube API client
            
        Raises:
            YouTubeAPIError: If API initialization fails
        """
        if not credentials:
            raise YouTubeAPIError("YouTube API credentials are required")
            
        try:
            return googleapiclient.discovery.build(
                "youtube", "v3", 
                developerKey=credentials,
                cache_discovery=False  # Disable cache to prevent warnings
            )
        except Exception as e:
            log_manager.error(
                logger_name,
                "Failed to initialize YouTube API",
                context={"content_flow_id": self.content_flow_id},
                error=e
            )
            raise YouTubeAPIError("Failed to initialize YouTube API") from e

    def source_content(self) -> List[ProcessedVideo]:
        """Fetch and process videos based on discovery and sourcing parameters."""
        try:
            discovered_content = self.discover_content()
            if not discovered_content:
                log_manager.info(logger_name, "No content discovered")
                return []
                
            extracted_content = []
            for content in discovered_content:
                try:
                    result = self.extract_content(content)
                    if result:
                        extracted_content.append(result)
                except YouTubeContentError as e:
                    # Log but continue with other videos
                    log_manager.error(
                        logger_name,
                        "Failed to process video",
                        context={"video_id": content.get("video_id")},
                        error=e
                    )
                    continue
            
            return extracted_content
            
        except HttpError as e:
            log_manager.error(
                logger_name,
                "YouTube API error",
                context={"content_flow_id": self.content_flow_id},
                error=e
            )
            raise YouTubeAPIError("Failed to fetch content from YouTube") from e
        except Exception as e:
            log_manager.critical(
                logger_name,
                "Unexpected error in source_content",
                context={"content_flow_id": self.content_flow_id},
                error=e
            )
            raise YouTubeError("Unexpected error while sourcing content") from e
    
    def discover_content(self) -> List[VideoMetadata]:
        """Discover content based on specified strategy and source type."""
        if not self.discovery_parameters:
            raise YouTubeError("No discovery parameters provided")
            
        try:
            discovered_content = []
            
            if self.discovery_parameters.source_selection_strategy == SourceSelectionStrategy.STATIC:
                if self.discovery_parameters.source_type == SourceType.PLAYLIST:
                    if not self.discovery_parameters.playlist_ids:
                        raise YouTubeError("No playlist IDs provided")
                    playlist_content = self._fetch_from_playlist()
                    if playlist_content:
                        discovered_content.extend(playlist_content)
                elif self.discovery_parameters.source_type == SourceType.CHANNEL:
                    raise NotImplementedError("Channel source type not implemented")
                elif self.discovery_parameters.source_type == SourceType.VIDEO:
                    raise NotImplementedError("Video source type not implemented")
            elif self.discovery_parameters.source_selection_strategy == SourceSelectionStrategy.UNDERRATED:
                raise NotImplementedError("Underrated strategy not implemented")
            else:
                raise YouTubeError(f"Unknown source selection strategy: {self.discovery_parameters.source_selection_strategy}")

            return discovered_content
            
        except NotImplementedError:
            raise
        except YouTubeError:
            raise
        except Exception as e:
            log_manager.error(
                logger_name,
                "Error discovering content",
                context={
                    "strategy": self.discovery_parameters.source_selection_strategy,
                    "source_type": self.discovery_parameters.source_type
                },
                error=e
            )
            raise YouTubeError("Failed to discover content") from e

    def extract_content(self, content: VideoMetadata) -> Optional[ProcessedVideo]:
        """Extract and process content based on specified processing type."""
        if not content or not isinstance(content, dict) or "video_id" not in content:
            raise YouTubeError("Invalid content data provided")
            
        video_id = content["video_id"]
        try:
            if self.sourcing_parameters.processing_type == ContentProcessingType.MOST_REPLAYED:
                if not content.get("most_replayed_data"):
                    log_manager.warning(
                        logger_name,
                        "No most replayed data available",
                        context={"video_id": video_id}
                    )
                    return None
                    
                try:
                    start_time = content["most_replayed_data"]["timedMarkerDecorations"][0]["visibleTimeRangeStartMillis"]
                    end_time = content["most_replayed_data"]["timedMarkerDecorations"][0]["visibleTimeRangeEndMillis"]
                except (KeyError, IndexError) as e:
                    raise YouTubeContentError(f"Invalid most replayed data structure: {str(e)}")
                    
                downloaded_content = self._download_video_clip(video_id, start_time, end_time)
                if not downloaded_content:
                    return None
                    
                return self._add_metadata(downloaded_content, content)
                
            elif self.sourcing_parameters.processing_type == ContentProcessingType.FULL:
                downloaded_content = self._download_full_video(video_id)
                if not downloaded_content:
                    return None
                return self._add_metadata(downloaded_content, content)
                
            elif self.sourcing_parameters.processing_type == ContentProcessingType.COMBINE:
                raise NotImplementedError("Combine processing type not implemented")
            else:
                raise YouTubeError(f"Unknown processing type: {self.sourcing_parameters.processing_type}")
                
        except NotImplementedError:
            raise
        except YouTubeError:
            raise
        except Exception as e:
            log_manager.error(
                logger_name,
                "Error processing video",
                context={
                    "video_id": video_id,
                    "processing_type": self.sourcing_parameters.processing_type
                },
                error=e
            )
            raise YouTubeContentError(f"Failed to process video {video_id}") from e

    def _add_metadata(self, downloaded_content: ProcessedVideo, metadata: VideoMetadata) -> ProcessedVideo:
        """Add metadata from original content to the processed video.
        
        Args:
            downloaded_content: The processed video content with file info
            metadata: The original video metadata
            
        Returns:
            ProcessedVideo with both file info and metadata
        """
        downloaded_content.update({
            "title": metadata["title"],
            "description": metadata["description"],
            "thumbnail": metadata["thumbnail"],
            "published_at": metadata["published_at"],
            "url": metadata["url"],
            "platform": metadata["platform"],
            "most_replayed_data": metadata.get("most_replayed_data")
        })
        return downloaded_content

    def _download_full_video(self, video_id: str) -> ProcessedVideo:
        """Download the full video."""
        raise NotImplementedError()

    def _download_video_clip(self, video_id: str, start_time: int, end_time: int) -> ProcessedVideo:
        """Download a specific segment of a video."""
        if not video_id or not isinstance(video_id, str):
            raise YouTubeError("Invalid video ID")
        if not isinstance(start_time, (int, float)) or not isinstance(end_time, (int, float)):
            raise YouTubeError("Invalid time range")
        if start_time >= end_time:
            raise YouTubeError("Start time must be less than end time")
            
        try:
            url = f"https://www.youtube.com/watch?v={video_id}"
            output_template = f"downloads/{video_id}_clip.%(ext)s"
            
            ydl_opts = {
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'outtmpl': output_template,
                'download_ranges': lambda info: [[start_time/1000, end_time/1000]],
                'force_keyframes_at_cuts': True,
                'postprocessors': [{
                    'key': 'FFmpegVideoRemuxer',
                    'preferedformat': 'mp4',
                }],
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                try:
                    info = ydl.extract_info(url, download=True)
                except yt_dlp.utils.DownloadError as e:
                    raise YouTubeContentError(f"Failed to download video: {str(e)}")
                    
                downloaded_file = ydl.prepare_filename(info)
                if not os.path.exists(downloaded_file):
                    raise YouTubeContentError("Downloaded file not found")
                
                log_manager.info(
                    logger_name,
                    "Successfully downloaded video clip",
                    context={
                        "video_id": video_id,
                        "start_time": start_time,
                        "end_time": end_time,
                        "file": downloaded_file
                    }
                )
                
                return {
                    "file_path": downloaded_file,
                    "duration": (end_time - start_time) / 1000,
                    "video_id": video_id
                }
                
        except YouTubeError:
            raise
        except Exception as e:
            log_manager.error(
                logger_name,
                "Error downloading video clip",
                context={
                    "video_id": video_id,
                    "start_time": start_time,
                    "end_time": end_time
                },
                error=e
            )
            raise YouTubeContentError(f"Failed to download video {video_id}") from e

    def _fetch_from_playlist(self) -> List[VideoMetadata]:
        """Fetch videos from a playlist with their metadata."""
        playlist_id = self.discovery_parameters.playlist_ids[0]
        if self.discovery_parameters.content_selection_strategy == ContentSelectionStrategy.NON_SELECTIVE:
            try:
                db = SessionLocal() if self.sourcing_parameters.processing_type == ContentProcessingType.MOST_REPLAYED else None
                next_page_token = None
                
                try:
                    while True:
                        # Get playlist items with pagination
                        request = self.api.playlistItems().list(
                            part="snippet,contentDetails",
                            playlistId=playlist_id,
                            maxResults=50,  # Maximum allowed by API
                            pageToken=next_page_token
                        )
                        response = request.execute()
                        
                        if not response.get("items"):
                            break

                        if self.sourcing_parameters.processing_type == ContentProcessingType.MOST_REPLAYED:
                            for item in response["items"]:
                                video_id = item["contentDetails"]["videoId"]
                                
                                # Check if video was already posted
                                posted = db.query(PostedItem).filter(
                                    PostedItem.source_url.contains(video_id),
                                    PostedItem.content_flow_id == self.content_flow_id
                                ).first()
                                
                                if posted:
                                    continue
                                
                                # Try to get most replayed data
                                most_replayed_data = self._extract_most_replayed(video_id)
                                if not most_replayed_data:
                                    continue
                                    
                                # Get video details
                                # video_details = self._fetch_videos([video_id])[0]
                                
                                
                                return [{
                                    "platform": Platform.YOUTUBE.value,
                                    "video_id": video_id,
                                    "url": f"https://www.youtube.com/watch?v={video_id}",
                                    "title": item["snippet"]["title"],
                                    "description": item["snippet"]["description"],
                                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                                    "published_at": item["snippet"]["publishedAt"],
                                    "most_replayed_data": most_replayed_data
                                }]
                        else:
                            # For other content processing types
                            return []
                        
                        # Check if there are more pages
                        next_page_token = response.get("nextPageToken")
                        if not next_page_token:
                            break
                            
                finally:
                    if db:
                        db.close()
                    
                return []  # No videos found or no suitable most replayed videos
                
            except HttpError as e:
                log_manager.error(
                    logger_name,
                    "Error fetching playlist",
                    context={"playlist_id": playlist_id},
                    error=e
                )
                raise YouTubeAPIError("Failed to fetch playlist") from e
        else:
            return []
            

    def _fetch_videos(self, video_ids: List[str]) -> List[Dict[str, Any]]:
        """Fetch specific videos by their IDs with full details"""
        if not video_ids:
            return []

        try:
            videos_response = (
                self.api.videos()
                .list(
                    part="snippet,contentDetails,statistics",
                    id=",".join(video_ids)
                )
                .execute()
            )
            
            # we also need to put subtitles here
            return [
                {
                    "platform": Platform.YOUTUBE.value,
                    "id": video["id"],
                    "url": f"https://www.youtube.com/watch?v={video['id']}",
                    "title": video["snippet"]["title"],
                    "description": video["snippet"]["description"],
                    "thumbnail": video["snippet"]["thumbnails"]["high"]["url"],
                    "published_at": video["snippet"]["publishedAt"],
                    "duration": self._parse_duration(video["contentDetails"]["duration"]),
                    "view_count": int(video["statistics"].get("viewCount", 0)),
                    "like_count": int(video["statistics"].get("likeCount", 0)),
                    "comment_count": int(video["statistics"].get("commentCount", 0)),
                    "category": video["snippet"].get("categoryId")
                }
                for video in videos_response.get("items", [])
            ]

        except Exception as e:
            log_manager.error(
                logger_name,
                "Error fetching videos",
                context={"video_ids": video_ids},
                error=e
            )
            raise YouTubeAPIError("Failed to fetch videos") from e

    def _parse_duration(self, duration: str) -> int:
        """Parse YouTube duration format (ISO 8601) to seconds"""
        return int(parse_duration(duration).total_seconds())

    def _extract_most_replayed(self, video_id: str) -> Optional[Dict[str, Any]]:
        """Extract most replayed data from a YouTube video"""
        if not video_id or not isinstance(video_id, str):
            raise YouTubeError("Invalid video ID")
            
        try:
            url = f"https://www.youtube.com/watch?v={video_id}"
            headers = {'Accept-Language': 'en-US,en;q=0.9'}
            
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
            except requests.RequestException as e:
                raise YouTubeContentError(f"Failed to fetch video page: {str(e)}")
            
            soup = BeautifulSoup(response.text, "html.parser")
            script_tag = soup.find("script", string=re.compile("var ytInitialData = "))
            if not script_tag:
                log_manager.warning(
                    logger_name,
                    "No ytInitialData found in page",
                    context={"video_id": video_id}
                )
                return None
                
            try:
                ytInitialData_str = re.search(r"var ytInitialData = ({.*?});", script_tag.string).group(1)
                json_data = json.loads(ytInitialData_str)
                most_replayed = json_data['frameworkUpdates']['entityBatchUpdate']['mutations'][0]['payload']['macroMarkersListEntity']['markersList']
            except (AttributeError, KeyError, IndexError, json.JSONDecodeError) as e:
                raise YouTubeContentError(f"Failed to parse most replayed data: {str(e)}")
            
            # Process markers
            for marker in most_replayed['markers']:
                marker.pop('durationMillis', None)
                marker['startMillis'] = int(marker['startMillis'])
            
            # Handle timedMarkerDecorations
            if 'markersDecoration' in most_replayed and 'timedMarkerDecorations' in most_replayed['markersDecoration']:
                timed_decorations = most_replayed['markersDecoration']['timedMarkerDecorations']
                
                # Create a list of decorations with their max intensity
                decorations_with_intensity = []
                for dec in timed_decorations:
                    start_ms = dec.get('visibleTimeRangeStartMillis')
                    end_ms = dec.get('visibleTimeRangeEndMillis')
                    
                    # Find markers that fall within this time range
                    range_markers = [
                        m for m in most_replayed['markers']
                        if start_ms <= m['startMillis'] <= end_ms
                    ]
                    
                    # Get the maximum intensity in this range
                    max_intensity = max(
                        (m['intensityScoreNormalized'] for m in range_markers),
                        default=0
                    )
                    
                    decorations_with_intensity.append({
                        'decoration': {
                            'visibleTimeRangeStartMillis': start_ms,
                            'visibleTimeRangeEndMillis': end_ms
                        },
                        'max_intensity': max_intensity
                    })
                
                # Sort by intensity (highest first) and extract just the decorations
                sorted_decorations = [
                    d['decoration'] 
                    for d in sorted(
                        decorations_with_intensity,
                        key=lambda x: x['max_intensity'],
                        reverse=True
                    )
                ]
                
                most_replayed['timedMarkerDecorations'] = sorted_decorations
            else:
                # Generate our own most replayed section based on intensity scores
                markers = most_replayed['markers']
                if not markers:
                    return None
                    
                # Find the highest intensity section
                max_intensity = max(markers, key=lambda x: x['intensityScoreNormalized'])
                max_index = markers.index(max_intensity)
                peak_time = max_intensity['startMillis']
                
                # Get video duration from markers (last marker's start time)
                duration_ms = markers[-1]['startMillis']
                
                # Create a 30-second window centered around the peak
                window_ms = 30000  # 30 seconds in milliseconds
                half_window = window_ms // 2
                
                # Calculate start and end times with bounds checking
                start_time = max(0, peak_time - half_window)
                end_time = min(duration_ms, peak_time + half_window)
                
                # If we hit the bounds, shift the window to maintain 30 seconds
                if start_time == 0:
                    end_time = min(duration_ms, window_ms)
                elif end_time == duration_ms:
                    start_time = max(0, duration_ms - window_ms)
                
                most_replayed['timedMarkerDecorations'] = [{
                    'visibleTimeRangeStartMillis': start_time,
                    'visibleTimeRangeEndMillis': end_time
                }]
            
            # Clean up unnecessary keys
            most_replayed = {
                'markers': most_replayed['markers'],
                'timedMarkerDecorations': most_replayed['timedMarkerDecorations']
            }
            
            return most_replayed
            
        except YouTubeError:
            raise
        except Exception as e:
            log_manager.error(
                logger_name,
                "Error extracting most replayed data",
                context={"video_id": video_id},
                error=e
            )
            raise YouTubeContentError("Failed to extract most replayed data") from e
