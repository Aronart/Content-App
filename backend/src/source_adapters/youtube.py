# backend/src/source_adapters/youtube.py
from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from src.source_adapters.base import SourceAdapter
from src.core.config import Settings
from src.database.schemas import YouTubeParameters, SourceType, ContentSelectionStrategy
from src.source_adapters.registry import SourceRegistry
from src.database.models import Platform
import googleapiclient.discovery
import isodate

settings = Settings()


@SourceRegistry.register(Platform.YOUTUBE)
class YouTubeAdapter(SourceAdapter):
    def __init__(self, credentials, parameters):
        self.api = None
        self.credentials = credentials
        self.parameters: YouTubeParameters = parameters

    def auth(self, credentials) -> None:
        """Configure the YouTube adapter with API credentials and parameters"""
        self.api = googleapiclient.discovery.build(
            "youtube", "v3", developerKey=settings.YOUTUBE_API_KEY
        )

    def fetch_content(self) -> Dict[str, Any]:
        """Fetch content from configured YouTube sources based on source_type"""
        try:
            if not self.api:
                self.auth(self.credentials)

            videos = []
            if self.parameters.source_type == SourceType.CHANNEL:
                videos.extend(self._fetch_from_channels(self.parameters.channel_ids))
            elif self.parameters.source_type == SourceType.PLAYLIST:
                videos.extend(self._fetch_from_playlists(self.parameters.playlist_ids))
            elif self.parameters.source_type == SourceType.VIDEO:
                videos.extend(self._fetch_videos(self.parameters.video_ids))

            # Apply selection strategy
            if not videos:
                return []

            filtered_videos = self._apply_filters(videos)
            selected_videos = self._apply_selection_strategy(filtered_videos)
            
            return selected_videos[:self.parameters.max_items]

        except HttpError as e:
            raise Exception(f"YouTube API error: {str(e)}")

    def _fetch_from_channels(self, channel_ids: List[str]) -> List[Dict[str, Any]]:
        """Fetch videos from specified channels"""
        videos = []
        for channel_id in channel_ids:
            try:
                # Get channel uploads playlist
                channel_response = (
                    self.api.channels()
                    .list(part="contentDetails", id=channel_id)
                    .execute()
                )

                if not channel_response.get("items"):
                    continue

                playlist_id = channel_response["items"][0]["contentDetails"][
                    "relatedPlaylists"
                ]["uploads"]

                # Get videos from uploads playlist
                channel_videos = self._fetch_from_playlists(
                    [playlist_id], 
                    max_results=self.parameters.max_videos_per_channel
                )
                videos.extend(channel_videos)

            except Exception as e:
                print(f"Error fetching from channel {channel_id}: {str(e)}")
                continue

        return videos

    def _fetch_from_playlists(
        self, 
        playlist_ids: List[str], 
        max_results: int = None
    ) -> List[Dict[str, Any]]:
        """Fetch videos from specified playlists"""
        if max_results is None:
            max_results = self.parameters.max_items

        videos = []
        for playlist_id in playlist_ids:
            try:
                playlist_response = (
                    self.api.playlistItems()
                    .list(
                        part="snippet",
                        playlistId=playlist_id,
                        maxResults=max_results,
                    )
                    .execute()
                )

                video_ids = [
                    item["snippet"]["resourceId"]["videoId"] 
                    for item in playlist_response.get("items", [])
                ]
                
                playlist_videos = self._fetch_videos(video_ids)
                videos.extend(playlist_videos)

            except Exception as e:
                print(f"Error fetching from playlist {playlist_id}: {str(e)}")
                continue

        return videos

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

            return [
                {
                    "platform": Platform.YOUTUBE.value,
                    "video_id": video["id"],
                    "url": f"https://www.youtube.com/watch?v={video['id']}",
                    "title": video["snippet"]["title"],
                    "description": video["snippet"]["description"],
                    "thumbnail": video["snippet"]["thumbnails"]["high"]["url"],
                    "published_at": video["snippet"]["publishedAt"],
                    "duration": self._parse_duration(video["contentDetails"]["duration"]),
                    "view_count": int(video["statistics"].get("viewCount", 0)),
                    "like_count": int(video["statistics"].get("likeCount", 0)),
                    "comment_count": int(video["statistics"].get("commentCount", 0)),
                    "category": video["snippet"].get("categoryId"),
                }
                for video in videos_response.get("items", [])
            ]

        except Exception as e:
            print(f"Error fetching videos {video_ids}: {str(e)}")
            return []

    def _apply_filters(self, videos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Apply parameter-based filters to videos"""
        filtered_videos = videos

        # Apply duration filters
        if self.parameters.min_duration is not None or self.parameters.max_duration is not None:
            filtered_videos = [
                video for video in filtered_videos
                if self._check_duration_constraints(video["duration"])
            ]

        # Apply category filter
        if self.parameters.category:
            filtered_videos = [
                video for video in filtered_videos
                if video["category"] == self.parameters.category
            ]

        return filtered_videos

    def _apply_selection_strategy(self, videos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Apply the specified selection strategy to the videos"""
        if not videos:
            return []

        strategy = self.parameters.selection_strategy
        
        if strategy == ContentSelectionStrategy.MOST_VIEWED:
            return sorted(videos, key=lambda x: x["view_count"], reverse=True)
        elif strategy == ContentSelectionStrategy.MOST_RECENT:
            return sorted(videos, key=lambda x: x["published_at"], reverse=True)
        elif strategy == ContentSelectionStrategy.TRENDING:
            return sorted(
                videos,
                key=lambda x: (
                    x["view_count"] * 0.4 +
                    x["like_count"] * 0.4 +
                    x["comment_count"] * 0.2
                ),
                reverse=True
            )
        elif strategy == ContentSelectionStrategy.RANDOM:
            import random
            random.shuffle(videos)
            return videos
        else:
            return videos

    def validate_content(self, content: List[Dict[str, Any]]) -> bool:
        """Validate that the content meets our requirements"""
        if not content:
            return False

        required_fields = ["video_id", "url", "title", "duration"]
        for video in content:
            if not all(field in video for field in required_fields):
                return False

            # Check duration constraints
            if not self._check_duration_constraints(video["duration"]):
                return False

        return True

    def _check_duration_constraints(self, duration: int) -> bool:
        """Check if video duration meets constraints"""
        if self.parameters.min_duration and duration < self.parameters.min_duration:
            return False
        if self.parameters.max_duration and duration > self.parameters.max_duration:
            return False
        return True

    def _parse_duration(self, duration: str) -> int:
        """Parse YouTube duration format (ISO 8601) to seconds"""
        return int(isodate.parse_duration(duration).total_seconds())
