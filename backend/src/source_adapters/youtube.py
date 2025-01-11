# backend/src/source_adapters/youtube.py
from typing import Dict, Any, List
import googleapiclient.discovery
from src.source_adapters.base import SourceAdapter
from src.core.config import Settings

from registry import SourceRegistry
from database.models import Platform

settings = Settings()

@SourceRegistry.register(Platform.YOUTUBE)
class YouTubeAdapter(SourceAdapter):
    def __init__(self, credentials, parameters):
        self.api = None
        self.credentials = credentials
        self.parameters = parameters

    def auth(self, credentials) -> None:
        """Configure the YouTube adapter with API credentials and parameters"""
        self.api = googleapiclient.discovery.build(
            "youtube", 
            "v3", 
            developerKey=settings.YOUTUBE_API_KEY
        )

    def fetch_content(self) -> Dict[str, Any]:
        """Fetch content from configured YouTube channels"""
        try:
            # Get videos from specified channels
            channel_ids = self.config.get("channel_ids", [])
            videos = []
            for channel_id in channel_ids:
                # Get channel uploads playlist
                channel_response = self.api.channels().list(
                    part="contentDetails",
                    id=channel_id
                ).execute()
                
                playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
                
                # Get recent videos from uploads playlist
                playlist_response = self.api.playlistItems().list(
                    part="snippet",
                    playlistId=playlist_id,
                    maxResults=self.config.get("max_videos_per_channel", 5)
                ).execute()
                
                for item in playlist_response["items"]:
                    video_id = item["snippet"]["resourceId"]["videoId"]
                    videos.append({
                        "platform": "youtube",
                        "video_id": video_id,
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "title": item["snippet"]["title"],
                        "description": item["snippet"]["description"],
                        "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                        "published_at": item["snippet"]["publishedAt"]
                    })
            
            return videos

        except HttpError as e:
            raise Exception(f"YouTube API error: {str(e)}")

    def validate_content(self, content: Dict[str, Any]) -> bool:
        """Validate that the content meets our requirements"""
        if not content:
            return False
            
        required_fields = ["video_id", "url", "title"]
        for video in content:
            if not all(field in video for field in required_fields):
                return False
                
            # Check video duration if specified in config
            if self.config.get("max_duration"):
                video_response = self.api.videos().list(
                    part="contentDetails",
                    id=video["video_id"]
                ).execute()
                
                duration = video_response["items"][0]["contentDetails"]["duration"]
                # Convert duration to seconds and compare with max_duration
                # Implementation of duration parsing would go here
                
        return True

    def _parse_duration(self, duration: str) -> int:
        """Helper method to parse YouTube duration format to seconds"""
        # Implementation would go here
        pass