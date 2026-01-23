from uuid import uuid4
from qdrant_client.models import PointStruct

from app.vector.client import get_qdrant_client
from app.vector.config import qdrant_settings
from app.llm.embeddings import embed_text
from app.schemas.memory import MemoryRecord


def index_memory(memory: MemoryRecord):
    """
    Store a MemoryRecord in Qdrant.

    This function:
    - Generates an embedding from the memory content
    - Prepares a payload combining metadata and system fields
    - Upserts the vector into the configured Qdrant collection
    """

    print(f"[VECTOR] Indexing memory (memory_id={memory.memory_id})")

    # Initialize Qdrant client
    client = get_qdrant_client()

    # 1️⃣ Generate embedding from memory content
    print("[VECTOR] Generating embedding for memory content...")
    vector = embed_text(memory.content)
    print("[VECTOR] Embedding generated successfully")

    # 2️⃣ Prepare payload (metadata + system fields)
    payload = {
        **memory.metadata,
        "source": memory.source,
        "created_at": memory.created_at.isoformat(),
    }
    print("[VECTOR] Payload prepared for Qdrant upsert")

    # 3️⃣ Upsert vector into Qdrant collection
    print("[VECTOR] Upserting memory vector into Qdrant...")
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

    print("[VECTOR][SUCCESS] Memory indexed successfully")
