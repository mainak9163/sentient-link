import { connectDB } from "@/lib/db"
import { AgentClient } from "./agent-client.service"
import { LinkRepository } from "./link.repository"
import { LOG_PREFIXES, SYNC_STATUS } from "./constants"
import type { SyncResponse, SyncLinkParams } from "./types"

export class AgentSyncService {
  private agentClient: AgentClient
  private repository: LinkRepository

  constructor() {
    this.agentClient = new AgentClient()
    this.repository = new LinkRepository()
  }

  async syncLinkStatus(params: SyncLinkParams): Promise<SyncResponse> {
    await connectDB()

    console.info(`${LOG_PREFIXES.AGENT_SYNC} Syncing link status`, {
      linkId: params.linkId,
      userId: params.userId,
    })

    // Fetch link from database
    const link = await this.repository.findByIdAndUser(
      params.linkId,
      params.userId
    )

    // Handle link not found or no agent request
    if (!link) {
      console.warn(`${LOG_PREFIXES.AGENT_SYNC} Link not found`, {
        linkId: params.linkId,
      })
      throw new LinkNotFoundError("Link not found")
    }

    if (!link.requestId) {
      console.info(`${LOG_PREFIXES.AGENT_SYNC} No agent request for link`, {
        linkId: params.linkId,
      })
      return { status: SYNC_STATUS.NO_AGENT }
    }

    // Fetch result from agent service
    const agentResponse = await this.agentClient.fetchResult(link.requestId)

    // If not completed, return current status
    if (!this.agentClient.isCompleted(agentResponse)) {
      return { status: agentResponse.status }
    }

    // If completed but no result, return status only
    if (!this.agentClient.hasResult(agentResponse)) {
      return { status: agentResponse.status }
    }

    // Update link with agent result
    const shouldApplyAlias = this.repository.shouldApplyAlias(
      link,
      agentResponse.result?.suggested_alias
    )

    await this.repository.updateWithAgentResult(
      link,
      agentResponse.result!,
      shouldApplyAlias
    )

    console.info(`${LOG_PREFIXES.AGENT_SYNC} Link updated successfully`, {
      linkId: params.linkId,
      aliasApplied: shouldApplyAlias,
    })

    return {
      status: SYNC_STATUS.COMPLETED,
      result: agentResponse.result,
    }
  }
}

export class LinkNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LinkNotFoundError"
  }
}