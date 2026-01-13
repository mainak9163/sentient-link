from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class BaseSchema(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
