from upload.platforms.base import UploadAdapter
from upload.platforms.registry import UploadRegistry
from database.models import Platform


@UploadRegistry.register(Platform.INSTAGRAM)
class InstaUploadAdapter(UploadAdapter):
    def __init__(self, credentials, parameters):
        self.api = None
        self.credentials = credentials
        self.parameters = parameters

    def auth(self, credentials):
        pass

    def upload(self):
        pass