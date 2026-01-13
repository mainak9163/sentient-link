from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Dict, Any
from app.schemas.base import BaseSchema


class AgentRequest(BaseSchema):
    link_id: str = Field(..., description="MongoDB link ID")
    original_url: HttpUrl
    user_intent: Optional[str] = Field(
        None, description="User-provided intent"
    )

    context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Extra context from web app"
    )
