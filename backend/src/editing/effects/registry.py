class TransformationRegistry:
    _registry = {}

    @classmethod
    def register(cls, name: str, transformation_class: type):
        cls._registry[name] = transformation_class

    @classmethod
    def get_transformation(cls, name: str):
        if name not in cls._registry:
            raise ValueError(f"Transformation '{name}' not registered.")
        return cls._registry[name]
