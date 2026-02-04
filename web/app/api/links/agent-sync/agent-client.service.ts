import { AGENT_CONFIG, LOG_PREFIXES, SYNC_STATUS } from "./constants"
import type { AgentApiResponse, AgentStatus } from "./types"

export class AgentClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {
    if (!AGENT_CONFIG.API_URL || !AGENT_CONFIG.API_KEY) {
      throw new Error("Agent configuration is missing")
    }

    this.baseUrl = AGENT_CONFIG.API_URL
    this.apiKey = AGENT_CONFIG.API_KEY
  }

  async fetchResult(requestId: string): Promise<AgentApiResponse> {
    try {
      console.info(`${LOG_PREFIXES.AGENT_CLIENT} Fetching result`, {
        requestId,
      })

      const url = `${this.baseUrl}${AGENT_CONFIG.RESULT_ENDPOINT}/${requestId}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-KEY": this.apiKey,
        },
      })

      if (!response.ok) {
        console.warn(`${LOG_PREFIXES.AGENT_CLIENT} Agent returned ${response.status}`)
        return { status: SYNC_STATUS.PENDING as AgentStatus }
      }

      const data = await response.json()

      console.info(`${LOG_PREFIXES.AGENT_CLIENT} Result fetched`, {
        requestId,
        status: data.status,
      })

      return data
    } catch (error) {
      console.error(`${LOG_PREFIXES.AGENT_CLIENT} Fetch failed`, {
        error: error instanceof Error ? error.message : "Unknown error",
        requestId,
      })

      return { status: SYNC_STATUS.PENDING as AgentStatus }
    }
  }

  isCompleted(response: AgentApiResponse): boolean {
    return response.status === SYNC_STATUS.COMPLETED
  }

  hasResult(response: AgentApiResponse): boolean {
    return Boolean(response.result)
  }
}