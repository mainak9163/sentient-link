from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class BaseSchema(BaseModel):
    """
    Base schema providing common request-level fields.

    This schema is intended to be inherited by other request models
    to ensure consistent identification and timestamping.
    """

    #: Unique identifier for the request (auto-generated)
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    #: Timestamp indicating when the schema instance was created
    timestamp: datetime = Field(default_factory=datetime.utcnow)
