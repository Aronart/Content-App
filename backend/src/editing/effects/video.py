from backend.src.database.models import Transformation
from registry import TransformationRegistry


@TransformationRegistry.register(Transformation.TRIM)
class TrimTransformation(Transformation):
    def apply(self, path: str, parameters) -> str:
        pass


@TransformationRegistry.register(Transformation.SUBTITLES)
class SubtitleTransformation(Transformation):
    def apply(self, path: str, parameters) -> str:
        pass


@TransformationRegistry.register(Transformation.COMBINE)
class CombineVideos(Transformation):
    def apply(self, path: str, parameters) -> str:
        pass
