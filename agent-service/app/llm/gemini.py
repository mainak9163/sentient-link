from google import genai
from app.core.config import settings

class GeminiClient:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

        self.fast_model = "gemini-2.5-flash"
        self.deep_model = "gemini-2.5-pro"

    def fast_generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.fast_model,
            contents=prompt,
        )
        return response.text

    def deep_generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.deep_model,
            contents=prompt,
        )
        return response.text


# Singleton
gemini_client = GeminiClient()
