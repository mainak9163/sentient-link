from uuid import uuid4
from qdrant_client.models import PointStruct

from app.vector.client import get_qdrant_client
from app.vector.config import qdrant_settings
from app.llm.embeddings import embed_text
from app.schemas.memory import MemoryRecord


def index_memory(memory: MemoryRecord):
    """
    Store a MemoryRecord in Qdrant.
    """
    client = get_qdrant_client()

    # 1️⃣ Generate embedding from content
    vector = embed_text(memory.content)

    # 2️⃣ Prepare payload (metadata + system fields)
    payload = {
        **memory.metadata,
        "source": memory.source,
        "created_at": memory.created_at.isoformat(),
    }

    # 3️⃣ Upsert into Qdrant
    client.upsert(
        collection_name=qdrant_settings.collection_name,
        points=[
            PointStruct(
                id=memory.memory_id or str(uuid4()),
                vector=vector,
                payload=payload,
            )
        ],
    )
