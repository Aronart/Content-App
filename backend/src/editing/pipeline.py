from typing import Dict, Any, List
from src.database.models import Transformation
from src.editing.effects.registry import TransformationRegistry
from src.editing.effects.base import Transformation as TransformationBase
from src.logging.log_manager import LogManager

log_manager = LogManager()
logger_name = "transformation-pipeline"


class TransformationError(Exception):
    """Base exception for transformation errors."""
    pass


class TransformationPipeline:
    """Pipeline for applying video transformations."""
    
    def __init__(self):
        """Initialize empty transformation pipeline."""
        self.steps: List[tuple[TransformationBase, Dict[str, Any]]] = []
    
    def add_step(self, transformation: TransformationBase, parameters: Dict[str, Any] = None):
        """Add a transformation step to the pipeline.
        
        Args:
            transformation: Instance of a Transformation class
            parameters: Parameters for the transformation
        """
        if parameters is None:
            parameters = {}
            
        log_manager.info(
            logger_name,
            f"Adding {transformation.__class__.__name__} to pipeline",
            context={"parameters": parameters}
        )
        self.steps.append((transformation, parameters))
    
    def transform(self, content_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Execute all transformations in sequence on the given content.
        
        Args:
            content_items: List of content objects, each containing file_path and metadata
            
        Returns:
            List of modified content objects. May be shorter than input if items were combined.
            
        Raises:
            TransformationError: If any transformation step fails
        """
        try:
            log_manager.info(
                logger_name,
                "Starting transformation pipeline",
                context={"input_count": len(content_items)}
            )
            
            # Update content objects as we go
            current_items = content_items.copy()
            
            for transformation, parameters in self.steps:
                transformation_name = transformation.__class__.__name__
                log_manager.info(
                    logger_name,
                    f"Applying {transformation_name}",
                    context={
                        "input_count": len(current_items),
                        "parameters": parameters
                    }
                )
                
                # Apply transformation
                current_items = transformation.apply(current_items, parameters)
                
                # Track transformation history
                for item in current_items:
                    if "transformation_history" not in item:
                        item["transformation_history"] = []
                        
                    item["transformation_history"].append({
                        "transformation": transformation_name,
                        "parameters": parameters
                    })
                
                log_manager.info(
                    logger_name,
                    f"{transformation_name} complete",
                    context={"output_count": len(current_items)}
                )
            
            log_manager.info(
                logger_name,
                "Pipeline execution complete",
                context={
                    "input_count": len(content_items),
                    "output_count": len(current_items)
                }
            )
            
            return current_items
            
        except Exception as e:
            log_manager.error(
                logger_name,
                "Pipeline execution failed",
                context={
                    "input_count": len(content_items)
                },
                error=e
            )
            raise TransformationError(f"Pipeline execution failed: {str(e)}") from e
