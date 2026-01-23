from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime


class MemoryRecord(BaseModel):
    """
    Represents a single memory record used for Retrieval-Augmented Generation (RAG).

    Memory records are embedded, stored in a vector database, and later
    retrieved to provide contextual knowledge during agent execution.
    """

    #: Unique identifier for the memory record
    memory_id: str

    #: Source of the memory (e.g., "link", "agent", "reflection")
    source: str

    #: Primary textual content used for embedding and retrieval
    content: str

    #: Optional identifier of the associated embedding (if tracked separately)
    embedding_id: Optional[str] = None

    #: Arbitrary metadata associated with the memory (user_id, tags, scores, etc.)
    metadata: Dict[str, Any] = {}

    #: Timestamp when the memory was created
    created_at: datetime = Field(default_factory=datetime.utcnow)
