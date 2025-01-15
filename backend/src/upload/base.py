from abc import ABC, abstractmethod
from typing import Dict, Any


class UploadAdapter(ABC):
    @abstractmethod
    def auth(self, config: Dict[str, Any]) -> None:
        pass

    @abstractmethod
    def upload(self) -> Dict[str, Any]:
        pass
