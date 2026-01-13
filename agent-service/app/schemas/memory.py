from pydantic import BaseModel, Field
from typing import  Dict, Any, Optional
from datetime import datetime


class MemoryRecord(BaseModel):
    memory_id: str
    source: str  # "link", "agent", "reflection"
    content: str
    embedding_id: Optional[str] = None
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
