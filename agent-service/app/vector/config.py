from pydantic import BaseModel
import os


class QdrantSettings(BaseModel):
    url: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    api_key: str = os.getenv("QDRANT_API_KEY", "")
    collection_name: str = "agent_memory"


qdrant_settings = QdrantSettings()
