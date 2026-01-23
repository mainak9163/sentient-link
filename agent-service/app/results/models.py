from pydantic import BaseModel
from typing import Dict, Any, Optional, Union
from datetime import datetime


class AgentResult(BaseModel):
    """
    Represents the persisted result of an agent job.

    This model is used to track the lifecycle of a background job,
    from initial queueing through completion or failure.
    """

    #: Unique request identifier (used for tracing across systems)
    request_id: str

    #: Type/category of agent job being executed
    job_type: str

    #: Identifier of the user who initiated the job
    user_id: str

    #: Identifier of the link associated with the job
    link_id: str

    #: Current job status: queued | completed | failed
    status: str

    #: Final result payload (structured data or raw text), if available
    result: Optional[Union[Dict[str, Any], str]] = None

    #: Timestamp when the result record was created
    created_at: datetime
