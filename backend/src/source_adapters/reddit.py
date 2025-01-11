from typing import Dict, Any, List
import praw
from src.source_adapters.base import SourceAdapter
from src.core.config import Settings

from registry import SourceRegistry
from database.models import Platform

settings = Settings()

@SourceRegistry.register(Platform.REDDIT)
class RedditAdapter(SourceAdapter):
    def __init__(self):
        self.reddit = None
        self.config = None

    def auth(self, config: Dict[str, Any]) -> None:
        """Configure the Reddit adapter with API credentials and parameters"""
        self.config = config
        self.reddit = praw.Reddit(
            client_id=settings.REDDIT_CLIENT_ID,
            client_secret=settings.REDDIT_CLIENT_SECRET,
            user_agent=settings.REDDIT_USER_AGENT
        )

    def fetch_content(self) -> List[Dict[str, Any]]:
        """Fetch content from configured subreddits"""
        try:
            content_list = []
            subreddits = self.config.get("subreddits", [])
            time_filter = self.config.get("time_filter", "day")
            limit = self.config.get("limit", 10)

            for subreddit_name in subreddits:
                subreddit = self.reddit.subreddit(subreddit_name)
                
                # Get top posts
                for submission in subreddit.top(time_filter=time_filter, limit=limit):
                    if self._is_valid_submission(submission):
                        content_list.append({
                            "platform": "reddit",
                            "post_id": submission.id,
                            "url": submission.url,
                            "title": submission.title,
                            "subreddit": subreddit_name,
                            "score": submission.score,
                            "media_type": self._get_media_type(submission),
                            "created_utc": submission.created_utc
                        })

            return content_list

        except Exception as e:
            raise Exception(f"Reddit API error: {str(e)}")

    def validate_content(self, content: List[Dict[str, Any]]) -> bool:
        """Validate that the content meets our requirements"""
        if not content:
            return False

        required_fields = ["post_id", "url", "title", "media_type"]
        
        for post in content:
            if not all(field in post for field in required_fields):
                return False
                
            # Check if content type is supported
            if post["media_type"] not in ["video", "image", "gif"]:
                return False
                
            # Check minimum score if specified
            min_score = self.config.get("min_score", 0)
            if post["score"] < min_score:
                return False

        return True

    def _is_valid_submission(self, submission) -> bool:
        """Check if a submission meets basic criteria"""
        # Skip self posts and non-media posts
        if submission.is_self or not hasattr(submission, 'url'):
            return False
            
        # Check domain whitelist if specified
        allowed_domains = self.config.get("allowed_domains", [])
        if allowed_domains and submission.domain not in allowed_domains:
            return False
            
        return True

    def _get_media_type(self, submission) -> str:
        """Determine the type of media in the submission"""
        url = submission.url.lower()
        
        # Check if it's a video
        if hasattr(submission, 'is_video') and submission.is_video:
            return "video"
            
        # Check if it's an image
        if any(url.endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            return "image"
            
        # Check if it's a gif
        if url.endswith('.gif') or 'gfycat.com' in url or 'imgur.com' in url:
            return "gif"
            
        return "unknown"
