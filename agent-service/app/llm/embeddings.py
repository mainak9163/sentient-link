import hashlib
import json
from typing import List

from google import genai
from google.genai import types

from app.core.config import settings
from app.queue.connection import get_redis

# Redis connection
redis = get_redis()

# Gemini client
client = genai.Client(api_key=settings.gemini_api_key)

# Embedding config
EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 768
CACHE_TTL = 60 * 60 * 24 * 7  # 7 days


def _hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def embed_text(text: str) -> List[float]:
    """
    Generate (or retrieve cached) embedding for text.
    Sync, stable, JSON-safe.
    """

    key = f"embed:{_hash_text(text)}"

    # 1️⃣ Check Redis cache
    cached = redis.get(key)
    if cached:
        return json.loads(cached.decode("utf-8"))

    # 2️⃣ Call Gemini embeddings (OFFICIAL API)
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=EMBEDDING_DIM
        ),
    )

    # 3️⃣ Extract embedding correctly
    [embedding_obj] = result.embeddings
    vector = list(embedding_obj.values)  # ✅ plain list[float]

    # 4️⃣ Cache embedding
    redis.setex(
        key,
        CACHE_TTL,
        json.dumps(vector)
    )

    return vector
