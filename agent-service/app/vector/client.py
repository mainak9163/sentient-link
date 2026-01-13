from qdrant_client import QdrantClient
from app.vector.config import qdrant_settings

def get_qdrant_client() -> QdrantClient:
    return QdrantClient(
        url=qdrant_settings.url,
        timeout=30,
    )
