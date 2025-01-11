from typing import Type, Dict
from base import UploadAdapter
from database.models import Platform

class UploadRegistry:
    _registry: Dict[Platform, Type[UploadAdapter]] = {}

    @classmethod
    def register(cls, platform: Platform):
        def wrapper(adapter_class: Type[UploadAdapter]):
            cls._registry[platform] = adapter_class
            return adapter_class
        return wrapper

    @classmethod
    def get_adapter(cls, platform: Platform) -> Type[UploadAdapter]:
        if platform not in cls._registry:
            raise ValueError(f"No adapter registered for platform: {platform}")
        return cls._registry[platform]
