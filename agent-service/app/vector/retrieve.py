from app.vector.client import client
from app.vector.config import qdrant_settings
from app.llm.embeddings import embed_text


def retrieve_memories(query_text: str, user_id: str, limit: int = 5):
    embedding = embed_text(query_text)

    response = client.query_points(
        collection_name=qdrant_settings.collection_name,
        query=embedding,
        limit=limit,
        with_payload=True,
    )

    memories = []

    for point in response.points:
        payload = point.payload or {}
        metadata = payload.get("metadata", {})

        if metadata.get("user_id") == user_id:
            memories.append(payload)

    return memories
