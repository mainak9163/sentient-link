import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined")
}

const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Lightweight Gemini call for frontend / fallback usage
 * - No memory
 * - No RAG
 * - No retries
 * - Fast
 */
export async function runGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  })

  const result = await model.generateContent(prompt)

  const text =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("Empty Gemini response")
  }

  return text
}
