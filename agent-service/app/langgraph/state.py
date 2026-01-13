from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AgentState(BaseModel):
    # Input
    user_id: str
    link_id: Optional[str]
    request_id: str
    original_url: str
    user_intent: str

    # RAG
    retrieved_memories: List[Dict[str, Any]] = []

    # Prompt
    prompt: Optional[str] = None

    # Output
    result: Optional[str] = None
