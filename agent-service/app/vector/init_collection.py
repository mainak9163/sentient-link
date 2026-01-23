from qdrant_client.http import models
from app.vector.client import client
from app.vector.config import qdrant_settings


def ensure_collection():
    """
    Ensure that the required Qdrant collection exists.

    If the collection is already present, this function exits silently.
    Otherwise, it creates the collection with the expected vector configuration.
    """

    print("[VECTOR] Ensuring Qdrant collection exists...")

    # Fetch existing collections from Qdrant
    collections = client.get_collections().collections
    names = {c.name for c in collections}

    # Exit early if collection already exists
    if qdrant_settings.collection_name in names:
        print(f"[VECTOR] Collection '{qdrant_settings.collection_name}' already exists")
        return

    print(f"[VECTOR] Creating collection '{qdrant_settings.collection_name}'...")

    # Create collection with vector configuration
    client.create_collection(
        collection_name=qdrant_settings.collection_name,
        vectors_config=models.VectorParams(
            size=768,  # MUST match Gemini embedding size
            distance=models.Distance.COSINE,
        ),
    )

    print("[VECTOR][SUCCESS] Qdrant collection created successfully")
