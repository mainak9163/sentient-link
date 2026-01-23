from app.llm.gemini import gemini_client
from app.llm.cache import get_cached_response, set_cached_response


def run_gemini(prompt: str, deep: bool = False) -> str:
    """
    Execute a Gemini LLM request with caching.

    Flow:
    1. Check Redis cache for existing response
    2. If cache hit → return cached result
    3. If cache miss → call Gemini (fast or deep)
    4. Store result in cache
    5. Return generated response
    """

    print("[LLM:SERVICE] Checking cache for Gemini response...")
    cached = get_cached_response(prompt)

    if cached:
        print("[LLM:SERVICE][CACHE HIT] Returning cached response")
        return cached

    print("[LLM:SERVICE][CACHE MISS] No cached response found")

    # Route to appropriate Gemini model
    if deep:
        print("[LLM:SERVICE] Using DEEP Gemini model")
        result = gemini_client.deep_generate(prompt)
    else:
        print("[LLM:SERVICE] Using FAST Gemini model")
        result = gemini_client.fast_generate(prompt)

    # Cache the generated response
    print("[LLM:SERVICE] Caching Gemini response...")
    set_cached_response(prompt, result)

    print("[LLM:SERVICE][SUCCESS] Gemini execution completed")

    return result
