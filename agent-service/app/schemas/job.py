from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.agent_request import AgentRequest


class AgentJob(BaseModel):
    """
    Represents a background agent job submitted for asynchronous processing.

    This model encapsulates:
    - The type of agent task to perform
    - The request payload required to execute the task
    - Execution metadata such as priority and retry count
    """

    #: Type of agent job to execute
    job_type: Literal["link_analysis", "security_check", "optimization", "reflection"]

    #: Request payload required by the agent
    payload: AgentRequest

    #: Job execution priority (1 = highest, 10 = lowest)
    priority: int = Field(default=5, ge=1, le=10)

    #: Number of retry attempts already performed
    retry_count: int = 0
