from typing import Type, Dict
from base import SourceAdapter
from database.models import Platform

class SourceRegistry:
    _registry: Dict[Platform, Type[SourceAdapter]] = {}

    @classmethod
    def register(cls, platform: Platform):
        """Decorator to register an adapter for a platform."""
        def wrapper(adapter_class: Type[SourceAdapter]):
            cls._registry[platform] = adapter_class
            return adapter_class
        return wrapper

    @classmethod
    def get_adapter(cls, platform: Platform) -> Type[SourceAdapter]:
        """Retrieve the adapter class for a given platform."""
        if platform not in cls._registry:
            raise ValueError(f"No adapter registered for platform: {platform}")
        return cls._registry[platform]
