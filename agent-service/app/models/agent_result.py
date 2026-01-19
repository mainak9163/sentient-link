from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class AgentResult(BaseModel):
    request_id: str
    job_type: str
    user_id: str
    link_id: str
    status: str  # queued | completed | failed
    result: Dict[str, Any] | str
    created_at: datetime
