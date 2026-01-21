from pydantic import BaseModel
from typing import Dict, Any, Optional, Union
from datetime import datetime


class AgentResult(BaseModel):
    request_id: str
    job_type: str
    user_id: str
    link_id: str
    status: str  # queued | completed | failed
    result: Optional[Union[Dict[str, Any], str]] = None
    created_at: datetime
