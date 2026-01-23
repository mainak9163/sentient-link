from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AgentState(BaseModel):
    """
    Shared state model used by LangGraph nodes.

    This model is passed between nodes and progressively enriched
    during graph execution. Each node is responsible for updating
    only the fields it owns.
    """

    # =========================
    # Input (Provided at graph entry)
    # =========================

    #: Unique identifier of the user making the request
    user_id: str

    #: Optional identifier for the link being processed (if persisted)
    link_id: Optional[str]

    #: Unique request identifier for tracing/debugging
    request_id: str

    #: Original URL provided by the user
    original_url: str

    #: User-declared intent for analyzing the URL
    user_intent: str

    # =========================
    # RAG (Populated by retrieve_node)
    # =========================

    #: Retrieved contextual memories from vector store
    retrieved_memories: List[Dict[str, Any]] = []

    # =========================
    # Prompt (Populated by retrieve_node)
    # =========================

    #: Base prompt used for both retrieval and generation
    prompt: Optional[str] = None

    # =========================
    # Output (Populated by generate_node)
    # =========================

    #: Final LLM-generated result
    result: Optional[str] = None
