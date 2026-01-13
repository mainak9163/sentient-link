from typing import List
from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.vector.client import get_qdrant_client
from app.vector.config import qdrant_settings
from app.llm.embeddings import embed_text


def retrieve_memories(
    query_text: str,
    user_id: str,
    limit: int = 5,
) -> List[dict]:
    """
    Retrieve semantically similar memories for a user.
    """
    client = get_qdrant_client()

    query_vector = embed_text(query_text)

    results = client.search(
        collection_name=qdrant_settings.collection_name,
        query_vector=query_vector,
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="user_id",
                    match=MatchValue(value=user_id),
                )
            ]
        ),
    )

    memories = []
    for hit in results:
        memories.append(
            {
                "score": hit.score,
                "payload": hit.payload,
            }
        )

    return memories
