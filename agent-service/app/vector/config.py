from pydantic import BaseModel
import os


class QdrantSettings(BaseModel):
    """
    Configuration settings for the Qdrant vector database.

    Values are primarily sourced from environment variables and
    provide connection and collection details for vector operations.
    """

    #: Base URL of the Qdrant service
    url: str = os.getenv("QDRANT_URL", "http://localhost:6333")

    #: API key for authenticating with Qdrant (if enabled)
    api_key: str = os.getenv("QDRANT_API_KEY", "")

    #: Name of the Qdrant collection used for agent memory storage
    collection_name: str = "agent_memory"


# Singleton settings instance used across the vector layer
qdrant_settings = QdrantSettings()
