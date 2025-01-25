from abc import ABC, abstractmethod
from typing import Dict, Any, TypeVar, Generic

T = TypeVar('T')  # For discovery parameters
U = TypeVar('U')  # For sourcing parameters

class SourceAdapter(ABC, Generic[T, U]):
    @abstractmethod
    def __init__(
        self,
        content_flow_id: int,
        credentials: Dict[str, str],
        discovery_parameters: T,
        sourcing_parameters: U
    ):
        """Initialize the source adapter.
        
        Args:
            content_flow_id: ID of the content flow using this adapter
            credentials: Dictionary of credentials needed for the platform
            discovery_parameters: Platform-specific parameters for content discovery
            sourcing_parameters: Platform-specific parameters for content sourcing
        """
        pass

    @abstractmethod
    def source_content(self):
        """Source content using the parameters provided in initialization.
        
        Returns:
            List of content items discovered and processed according to the parameters.
        """
        pass