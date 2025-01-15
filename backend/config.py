import json
from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"

    DATABASE_URL: str
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]  # Can be set as a comma-separated string in .env
    
    # Storage
    STORAGE_PATH: str = "storage"
    SOURCE_CONTENT_PATH: str = "storage/source"
    EDITED_CONTENT_PATH: str = "storage/edited"
    PREVIEWS_PATH: str = "storage/previews"
    
    # Content Settings
    MAX_CONTENT_SIZE: int = 500 * 1024 * 1024  # 500MB
    ALLOWED_CONTENT_TYPES: List[str] = ["video/mp4", "video/quicktime"]

    @classmethod
    def parse_cors_origins(cls, value: str) -> List[str]:
        """Parse the CORS origins field."""
        if not value:
            return []
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON format for BACKEND_CORS_ORIGINS: {value}")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
