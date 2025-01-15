from abc import ABC, abstractmethod
import ffmpeg
from typing import Dict, Any


class Transformation(ABC):
    @abstractmethod
    def apply(self, path: str) -> str:
        pass
