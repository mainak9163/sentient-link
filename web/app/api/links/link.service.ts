import crypto from "crypto"
import { connectDB } from "@/lib/db"
import { AgentService } from "./agent.service"
import { AliasGeneratorService } from "./alias-generator.service"
import { LinkRepository } from "./link.repository"
import { API_CONFIG, LOG_PREFIXES } from "./constants"
import type { LinkDocument, CreateLinkRequest, CreateLinkResponse } from "./types"

export class LinkService {
  private agentService: AgentService
  private aliasGenerator: AliasGeneratorService
  private repository: LinkRepository

  constructor() {
    this.agentService = new AgentService()
    this.aliasGenerator = new AliasGeneratorService()
    this.repository = new LinkRepository()
  }

  async createLink(
    userId: string,
    request: CreateLinkRequest
  ): Promise<CreateLinkResponse> {
    await connectDB()

    const { originalUrl, customCode, userIntent } = request
    const hasCustomCode = Boolean(customCode)

    // Generate or use custom short code
    let shortCode = customCode ?? this.aliasGenerator.generateRandomAlias()

    // Check for collisions
    const exists = await this.repository.exists(shortCode)
    if (exists) {
      throw new ConflictError("Short code already in use")
    }

    // Generate request ID for AI processing
    const requestId = hasCustomCode ? null : crypto.randomUUID()

    // Create link in database
    const link = await this.repository.create({
      userId,
      originalUrl,
      shortCode,
      requestId,
      aiStatus: hasCustomCode ? "skipped" : "pending",
    })

    // Trigger AI analysis if not using custom code
    if (!hasCustomCode) {
      shortCode = await this.processAIAnalysis(
        link,
        userId,
        originalUrl,
        userIntent,
        requestId
      )
    }

    console.info(`${LOG_PREFIXES.LINKS} Link created`, {
      linkId: link._id.toString(),
      shortCode,
      aiStatus: link.aiStatus,
    })

    return this.buildResponse(link, shortCode)
  }

  async getUserLinks(userId: string): Promise<Partial<LinkDocument>[]> {
    await connectDB()
    return this.repository.findByUserId(userId)
  }

  private async processAIAnalysis(
    link: LinkDocument,
    userId: string,
    originalUrl: string,
    userIntent: string | undefined,
    requestId: string | null
  ): Promise<string> {
    const payload = this.agentService.buildPayload({
      requestId,
      userId,
      linkId: link._id.toString(),
      originalUrl,
      userIntent: userIntent || "shorten link",
    })

    const agentSuccess = await this.agentService.triggerAnalysis(payload)

    if (!agentSuccess) {
      return this.handleAgentFailure(link, originalUrl, userIntent)
    }

    return link.shortCode
  }

  private async handleAgentFailure(
    link: LinkDocument,
    originalUrl: string,
    userIntent?: string
  ): Promise<string> {
    const fallbackAlias = await this.aliasGenerator.generateFallbackAlias(
      originalUrl,
      userIntent
    )

    await this.repository.updateShortCode(
      link._id,
      fallbackAlias,
      "fallback"
    )

    return fallbackAlias
  }

  private buildResponse(
    link: LinkDocument,
    shortCode: string
  ): CreateLinkResponse {
    return {
      id: link._id.toString(),
      requestId: link.requestId??"",
      originalUrl: link.originalUrl,
      shortUrl: `${API_CONFIG.BASE_URL}/r/${shortCode}`,
      shortCode,
      aiStatus: link.aiStatus,
      status: "created",
    }
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConflictError"
  }
}