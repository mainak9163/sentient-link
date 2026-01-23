from qdrant_client import QdrantClient
from app.vector.config import qdrant_settings


def get_qdrant_client() -> QdrantClient:
    """
    Create and return a Qdrant client using configured connection settings.

    This function centralizes Qdrant client initialization to ensure
    consistent configuration across the application.
    """

    print("[VECTOR] Creating Qdrant client...")

    return QdrantClient(
        url=qdrant_settings.url,
        api_key=qdrant_settings.api_key,
        timeout=30,
    )


# Shared Qdrant client instance
print("[VECTOR] Initializing shared Qdrant client instance...")
client = get_qdrant_client()
print("[VECTOR][SUCCESS] Qdrant client initialized")
