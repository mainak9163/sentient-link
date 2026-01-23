from qdrant_client.models import VectorParams, Distance
from app.vector.client import get_qdrant_client
from app.vector.config import qdrant_settings

# TEMP vector size (must match embedding dimensionality)
VECTOR_SIZE = 768  # placeholder


def init_qdrant():
    """
    Initialize the Qdrant collection if it does not already exist.

    This function is intended to be run during application startup
    or as a one-time setup step.
    """

    print("[QDRANT] Initializing Qdrant collection...")

    # Initialize Qdrant client
    client = get_qdrant_client()

    # Fetch existing collections
    collections = client.get_collections().collections
    exists = any(c.name == qdrant_settings.collection_name for c in collections)

    # Exit early if collection already exists
    if exists:
        print(f"[QDRANT] Collection '{qdrant_settings.collection_name}' already exists")
        return

    print(f"[QDRANT] Creating collection '{qdrant_settings.collection_name}'...")

    # Create collection with vector configuration
    client.create_collection(
        collection_name=qdrant_settings.collection_name,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print("[QDRANT][SUCCESS] Collection created successfully")
