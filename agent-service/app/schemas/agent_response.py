from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.base import BaseSchema


class AgentRecommendation(BaseModel):
    suggested_alias: Optional[str]
    tags: List[str] = []
    risk_score: float = Field(..., ge=0.0, le=1.0)
    notes: Optional[str]


class AgentResponse(BaseSchema):
    success: bool
    recommendations: AgentRecommendation
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Extra debug or reasoning info"
    )
