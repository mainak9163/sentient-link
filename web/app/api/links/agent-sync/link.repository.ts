import { Link } from "@/models/link"
import type { LinkDocument, AgentResultData } from "./types"

export class LinkRepository {
  async findByIdAndUser(linkId: string, userId: string): Promise<LinkDocument | null> {
    return Link.findOne({ _id: linkId, userId })
  }

  async updateWithAgentResult(
    link: LinkDocument,
    result: AgentResultData,
    shouldUpdateAlias: boolean
  ): Promise<LinkDocument> {
    // Update AI-related fields
    link.aiStatus = "completed"
    link.aiResult = result

    // Update tags and risk score if provided
    if (result.tags) {
      link.tags = result.tags
    }

    if (result.risk_score !== undefined) {
      link.riskScore = result.risk_score
    }

    // Optionally apply suggested alias
    if (shouldUpdateAlias && result.suggested_alias) {
      link.shortCode = result.suggested_alias
    }

    return link.save()
  }

  shouldApplyAlias(link: LinkDocument, suggestedAlias?: string): boolean {
    return !link.customAlias && Boolean(suggestedAlias)
  }
}