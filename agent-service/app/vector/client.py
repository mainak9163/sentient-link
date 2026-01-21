from qdrant_client import QdrantClient
from app.vector.config import qdrant_settings


def get_qdrant_client() -> QdrantClient:
    return QdrantClient(
        url=qdrant_settings.url,
        api_key=qdrant_settings.api_key,
        timeout=30,
    )


client = get_qdrant_client()
