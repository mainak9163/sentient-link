import hashlib
import json
from typing import List

from google import genai
from google.genai import types

from app.core.config import settings
from app.queue.connection import get_redis

# ======================================
# Infrastructure setup
# ======================================

# Redis connection (used for embedding cache)
redis = get_redis()

# Gemini client for embedding generation
client = genai.Client(api_key=settings.gemini_api_key)

# Embedding configuration
EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 768
CACHE_TTL = 60 * 60 * 24 * 7  # 7 days


def _hash_text(text: str) -> str:
    """
    Generate a deterministic SHA-256 hash for a given text input.

    Used to create stable Redis cache keys for embeddings.
    """
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def embed_text(text: str) -> List[float]:
    """
    Generate (or retrieve cached) embedding for text.

    Characteristics:
    - Synchronous
    - Deterministic
    - JSON-safe
    - Cached via Redis
    """

    print("[EMBED] Generating embedding for text")

    key = f"embed:{_hash_text(text)}"

    # 1️⃣ Check Redis cache
    cached = redis.get(key)
    if cached:
        print("[EMBED][CACHE HIT] Returning cached embedding")
        return json.loads(cached.decode("utf-8"))

    print("[EMBED][CACHE MISS] No cached embedding found")

    # 2️⃣ Call Gemini embeddings (official API)
    print("[EMBED] Calling Gemini embedding model...")
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=EMBEDDING_DIM),
    )

    # 3️⃣ Extract embedding correctly
    [embedding_obj] = result.embeddings
    vector = list(embedding_obj.values)  # ✅ plain list[float]

    print("[EMBED] Embedding generated successfully")

    # 4️⃣ Cache embedding
    redis.setex(key, CACHE_TTL, json.dumps(vector))

    print("[EMBED][SUCCESS] Embedding cached")

    return vector
