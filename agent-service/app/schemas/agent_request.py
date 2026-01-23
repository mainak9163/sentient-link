from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Dict, Any
from app.schemas.base import BaseSchema


class AgentRequest(BaseSchema):
    """
    Represents the input payload for an agent request.

    This schema captures all information required for the agent
    to analyze a URL and generate recommendations.
    """

    #: Identifier of the link stored in MongoDB
    link_id: str = Field(..., description="MongoDB link ID")

    #: Identifier of the user making the request
    user_id: str = Field(..., description="User ID")

    #: Original URL provided by the user (validated)
    original_url: HttpUrl

    #: Optional user-provided intent to guide analysis
    user_intent: Optional[str] = Field(None, description="User-provided intent")

    #: Additional contextual data passed from the web application
    context: Dict[str, Any] = Field(
        default_factory=dict, description="Extra context from web app"
    )
