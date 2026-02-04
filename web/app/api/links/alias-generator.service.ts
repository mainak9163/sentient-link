import { nanoid } from "nanoid"
import { runGemini } from "@/lib/gemini"
import {
  API_CONFIG,
  LOG_PREFIXES,
  GEMINI_PROMPT_TEMPLATE,
} from "./constants"

export class AliasGeneratorService {
  async generateFallbackAlias(
    originalUrl: string,
    userIntent?: string
  ): Promise<string> {
    try {
      console.info(`${LOG_PREFIXES.GEMINI} Generating fallback alias`)

      const prompt = this.buildPrompt(originalUrl, userIntent)
      const result = await runGemini(prompt)
      const alias = this.sanitizeAlias(result)

      console.info(`${LOG_PREFIXES.GEMINI} Alias generated`, { alias })

      return alias || this.generateRandomAlias()
    } catch (error) {
      console.error(
        `${LOG_PREFIXES.GEMINI} Fallback failed, using nanoid`,
        error
      )
      return this.generateRandomAlias()
    }
  }

  generateRandomAlias(): string {
    return nanoid(API_CONFIG.SHORT_CODE.DEFAULT_LENGTH)
  }

  private buildPrompt(url: string, intent?: string): string {
    return GEMINI_PROMPT_TEMPLATE.replace("{{url}}", url).replace(
      "{{intent}}",
      intent || "short link"
    )
  }

  private sanitizeAlias(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, API_CONFIG.SHORT_CODE.MAX_ALIAS_LENGTH)
  }
}