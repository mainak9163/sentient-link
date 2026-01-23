from app.vector.client import client
from app.vector.config import qdrant_settings
from app.llm.embeddings import embed_text


def retrieve_memories(query_text: str, user_id: str, limit: int = 5):
    """
    Retrieve relevant memory payloads from Qdrant using semantic similarity.

    This function:
    - Generates an embedding for the query text
    - Queries the Qdrant collection for nearest vectors
    - Filters results by user_id
    - Returns matching memory payloads
    """

    print("[VECTOR] Generating embedding for memory retrieval query...")
    embedding = embed_text(query_text)

    print(
        f"[VECTOR] Querying Qdrant for top {limit} similar memories "
        f"in collection '{qdrant_settings.collection_name}'"
    )

    response = client.query_points(
        collection_name=qdrant_settings.collection_name,
        query=embedding,
        limit=limit,
        with_payload=True,
    )

    memories = []

    print(f"[VECTOR] Retrieved {len(response.points)} candidate points")

    # Filter memories by user_id from payload metadata
    for point in response.points:
        payload = point.payload or {}
        metadata = payload.get("metadata", {})

        if metadata.get("user_id") == user_id:
            memories.append(payload)

    print(f"[VECTOR][SUCCESS] Returning {len(memories)} memories after user filtering")

    return memories
