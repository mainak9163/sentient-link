from app.llm.gemini import gemini_client
from app.llm.cache import get_cached_response, set_cached_response

def run_gemini(prompt: str, deep: bool = False) -> str:
    cached = get_cached_response(prompt)
    if cached:
        return cached

    if deep:
        result = gemini_client.deep_generate(prompt)
    else:
        result = gemini_client.fast_generate(prompt)

    set_cached_response(prompt, result)
    return result
