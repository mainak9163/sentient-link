import { API_CONFIG, LOG_PREFIXES } from "./constants"
import type { AgentTriggerPayload } from "./types"

export class AgentService {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {
    if (!API_CONFIG.AGENT.URL || !API_CONFIG.AGENT.API_KEY) {
      throw new Error("Agent configuration is missing")
    }

    this.baseUrl = API_CONFIG.AGENT.URL
    this.apiKey = API_CONFIG.AGENT.API_KEY
  }

  async triggerAnalysis(payload: AgentTriggerPayload): Promise<boolean> {
    try {
      console.info(`${LOG_PREFIXES.AGENT} Triggering link analysis`, {
        requestId: payload.request_id,
        linkId: payload.link_id,
      })

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.AGENT.ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": this.apiKey,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error(`Agent API returned ${response.status}`)
      }

      console.info(`${LOG_PREFIXES.AGENT} Trigger successful`, {
        linkId: payload.link_id,
      })

      return true
    } catch (error) {
      console.warn(
        `${LOG_PREFIXES.AGENT} Trigger failed — fallback path engaged`,
        {
          error: error instanceof Error ? error.message : "Unknown error",
          linkId: payload.link_id,
        }
      )

      return false
    }
  }

  buildPayload(params: {
    requestId: string | null
    userId: string
    linkId: string
    originalUrl: string
    userIntent: string
  }): AgentTriggerPayload {
    return {
      request_id: params.requestId,
      job_type: "link_analysis",
      user_id: params.userId,
      link_id: params.linkId,
      original_url: params.originalUrl,
      user_intent: params.userIntent || "shorten link",
      context: {},
    }
  }
}