from abc import ABC, abstractmethod
from typing import Dict, Any


class SourceAdapter(ABC):
    @abstractmethod
    def auth(self, config: Dict[str, Any]) -> None:
        pass

    @abstractmethod
    def fetch_content(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def validate_content(self, content: Dict[str, Any]) -> bool:
        pass
