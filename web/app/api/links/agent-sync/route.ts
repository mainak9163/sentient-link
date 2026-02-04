import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/get-auth-user"
import { AgentSyncService } from "./agent-sync.service"
import { RequestValidator } from "./request-validator"
import { ErrorHandler } from "./error-handler"
import { LOG_PREFIXES } from "./constants"
import type { AuthUser } from "./types"

const agentSyncService = new AgentSyncService()

/**
 * GET /api/agent-sync
 * Sync agent processing status and update link with results
 * @query linkId - The link ID to sync
 */
export async function GET(req: Request): Promise<NextResponse> {
  console.info(`${LOG_PREFIXES.AGENT_SYNC} GET /api/agent-sync`)

  try {
    // Authenticate user
    const user: AuthUser | null = await getAuthUser()
    if (!user) {
      return ErrorHandler.unauthorized()
    }

    // Validate and extract linkId
    const linkId = RequestValidator.validateLinkId(req.url)

    // Sync link status with agent
    const result = await agentSyncService.syncLinkStatus({
      linkId,
      userId: user.userId,
    })

    return NextResponse.json(result)
  } catch (error) {
    return ErrorHandler.handle(error)
  }
}