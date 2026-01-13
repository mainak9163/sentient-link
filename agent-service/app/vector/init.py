from qdrant_client.models import VectorParams, Distance
from app.vector.client import get_qdrant_client
from app.vector.config import qdrant_settings

# TEMP vector size (we’ll update when embeddings are added)
VECTOR_SIZE = 768  # placeholder

def init_qdrant():
    client = get_qdrant_client()

    collections = client.get_collections().collections
    exists = any(c.name == qdrant_settings.collection_name for c in collections)

    if exists:
        print("[QDRANT] Collection already exists")
        return

    client.create_collection(
        collection_name=qdrant_settings.collection_name,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print("[QDRANT] Collection created")
