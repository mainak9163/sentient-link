from google import genai
from app.core.config import settings


class GeminiClient:
    """
    Wrapper client for interacting with Google Gemini models.

    Provides separate methods for:
    - Fast, low-latency generation
    - Deep, higher-quality generation
    """

    def __init__(self):
        print("[LLM] Initializing Gemini client...")

        # Initialize Gemini SDK client using API key from settings
        self.client = genai.Client(api_key=settings.gemini_api_key)

        # Model identifiers
        self.fast_model = "gemini-2.5-flash"
        self.deep_model = "gemini-2.5-pro"

        print("[LLM][SUCCESS] Gemini client initialized")
        print(f"[LLM] Fast model: {self.fast_model}")
        print(f"[LLM] Deep model: {self.deep_model}")

    def fast_generate(self, prompt: str) -> str:
        """
        Generate content using the fast (low-latency) Gemini model.
        """

        print("[LLM] Generating response using FAST model...")
        response = self.client.models.generate_content(
            model=self.fast_model,
            contents=prompt,
        )
        print("[LLM] FAST model generation complete")

        return response.text

    def deep_generate(self, prompt: str) -> str:
        """
        Generate content using the deep (higher-quality) Gemini model.
        """

        print("[LLM] Generating response using DEEP model...")
        response = self.client.models.generate_content(
            model=self.deep_model,
            contents=prompt,
        )
        print("[LLM] DEEP model generation complete")

        return response.text


# Singleton instance shared across the application
print("[LLM] Creating singleton Gemini client instance...")
gemini_client = GeminiClient()
