from qdrant_client.http import models
from app.vector.client import client
from app.vector.config import qdrant_settings


def ensure_collection():
    collections = client.get_collections().collections
    names = {c.name for c in collections}

    if qdrant_settings.collection_name in names:
        return

    client.create_collection(
        collection_name=qdrant_settings.collection_name,
        vectors_config=models.VectorParams(
            size=768,  # MUST match Gemini embedding size
            distance=models.Distance.COSINE,
        ),
    )
