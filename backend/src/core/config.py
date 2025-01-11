from pydantic_settings import BaseSettings
from typing import Optional, List
import secrets

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/contentbot"
    Optional[str] = None
    
    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Storage
    STORAGE_PATH: str = "storage"
    SOURCE_CONTENT_PATH: str = "storage/source"
    EDITED_CONTENT_PATH: str = "storage/edited"
    PREVIEWS_PATH: str = "storage/previews"
    
    # Content Settings
    MAX_CONTENT_SIZE: int = 500 * 1024 * 1024  # 500MB
    ALLOWED_CONTENT_TYPES: List[str] = ["video/mp4", "video/quicktime"]
    
    # Platform API Keys (these would come from environment variables)
    YOUTUBE_API_KEY: Optional[str] = None
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    INSTAGRAM_ACCESS_TOKEN: Optional[str] = None
    TIKTOK_ACCESS_TOKEN: Optional[str] = None
    
    class Config:
        case_sensitive = True
        env_file = ".env"