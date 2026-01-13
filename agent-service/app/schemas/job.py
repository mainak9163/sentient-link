from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.agent_request import AgentRequest


class AgentJob(BaseModel):
    job_type: Literal[
        "link_analysis",
        "security_check",
        "optimization",
        "reflection"
    ]

    payload: AgentRequest
    priority: int = Field(default=5, ge=1, le=10)
    retry_count: int = 0
