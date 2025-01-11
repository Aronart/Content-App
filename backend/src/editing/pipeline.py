from typing import Dict, Any, List
from database.models import Transformation

class TransformationPipeline:
    def __init__(self):
        self.steps = []

    def add_step(self, transformation_name: str, parameters: Dict[str, Any]):
        """
        Dynamically add a transformation step to the pipeline.

        Args:
            transformation_name: The name of the transformation (as in the registry).
            parameters: Parameters to pass to the transformation.
        """
        pass

    def execute(self, clip: Any) -> Any:
        """
        Execute all transformations in sequence on the given clip.

        Args:
            clip: The initial video clip.

        Returns:
            Transformed clip after all steps.
        """
        for transformation, parameters in self.steps:
            clip = transformation.apply(clip, parameters)
        return clip
