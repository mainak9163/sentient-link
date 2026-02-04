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

    let shortCode: string
    let aliasSource: "custom" | "ai" | "gemini" | "nanoid"
    
    // Path 1: User provided custom code - use immediately
    if (hasCustomCode) {
      shortCode = customCode!
      aliasSource = "custom"

      const exists = await this.repository.exists(shortCode)
      if (exists) {
        throw new ConflictError("Short code already in use")
      }

      const link = await this.repository.create({
        userId,
        originalUrl,
        shortCode,
        requestId: null,
        aiStatus: "skipped",
      })

      console.info(`${LOG_PREFIXES.LINKS} Link created with custom code`, {
        linkId: link._id.toString(),
        shortCode,
      })

      return this.buildResponse(link, shortCode, aliasSource)
    }

    // Path 2: Wait for AI to generate alias
    const requestId = crypto.randomUUID()
    
    console.info(`${LOG_PREFIXES.LINKS} Triggering agent for alias generation...`)

    // Trigger agent
    const agentPayload = this.agentService.buildPayload({
      requestId,
      userId,
      linkId: "temp", // We don't have linkId yet
      originalUrl,
      userIntent: userIntent || "shorten link",
    })

    const agentTriggered = await this.agentService.triggerAnalysis(agentPayload)

    if (!agentTriggered) {
      // Agent service is down, use Gemini immediately
      console.warn(`${LOG_PREFIXES.LINKS} Agent unavailable, using Gemini`)
      return await this.createWithGeminiFallback(userId, originalUrl, userIntent)
    }

    // Poll agent result with timeout
    const agentResult = await this.pollAgentResult(requestId, 20000) // 20s max

    if (agentResult?.suggested_alias) {
      shortCode = agentResult.suggested_alias
      aliasSource = "ai"
      console.info(`${LOG_PREFIXES.LINKS} Agent generated alias`, { shortCode })
    } else {
      // Agent timeout or failed, use Gemini
      console.warn(`${LOG_PREFIXES.LINKS} Agent timeout/failed, using Gemini`)
      return await this.createWithGeminiFallback(userId, originalUrl, userIntent)
    }

    // Check for collision
    const exists = await this.repository.exists(shortCode)
    if (exists) {
      shortCode = `${shortCode}-${this.aliasGenerator.generateRandomAlias().slice(0, 3)}`
      console.warn(`${LOG_PREFIXES.LINKS} Collision detected, appended suffix`, { shortCode })
    }

    // Create link with AI-generated alias
    const link = await this.repository.create({
      userId,
      originalUrl,
      shortCode,
      requestId,
      aiStatus: "completed",
    })

    console.info(`${LOG_PREFIXES.LINKS} Link created with AI alias`, {
      linkId: link._id.toString(),
      shortCode,
    })

    return this.buildResponse(link, shortCode, aliasSource)
  }

  /**
   * Poll agent result endpoint until completed or timeout
   */
  private async pollAgentResult(
    requestId: string,
    maxDuration: number = 10000
  ): Promise<{ suggested_alias?: string } | null> {
    const startTime = Date.now()
    const pollInterval = 1000 // Poll every 1 second
    
    while (Date.now() - startTime < maxDuration) {
      try {
        const response = await fetch(
          `${API_CONFIG.AGENT.URL}/api/v1/agent/result/${requestId}`,
          {
            headers: {
              "X-API-KEY": API_CONFIG.AGENT.API_KEY!,
            },
          }
        )

        if (!response.ok) {
          // Agent returned error, wait and retry
          await this.sleep(pollInterval)
          continue
        }

        const data = await response.json()

        if (data.status === "completed" && data.result) {
          console.info(`${LOG_PREFIXES.LINKS} Agent completed`, {
            requestId,
            alias: data.result.suggested_alias,
          })
          return data.result
        }

        if (data.status === "failed") {
          console.warn(`${LOG_PREFIXES.LINKS} Agent failed`, { requestId })
          return null
        }

        // Status is "pending" or "processing", continue polling
        console.info(`${LOG_PREFIXES.LINKS} Agent status: ${data.status}`)
        await this.sleep(pollInterval)
      } catch (error) {
        console.error(`${LOG_PREFIXES.LINKS} Poll error`, error)
        await this.sleep(pollInterval)
      }
    }

    console.warn(`${LOG_PREFIXES.LINKS} Agent polling timeout`, { requestId })
    return null
  }

  /**
   * Fallback to Gemini when agent fails/timeouts
   */
  private async createWithGeminiFallback(
    userId: string,
    originalUrl: string,
    userIntent?: string
  ): Promise<CreateLinkResponse> {
    let shortCode: string
    let aliasSource: "gemini" | "nanoid"

    const geminiAlias = await this.aliasGenerator.generateFallbackAlias(
      originalUrl,
      userIntent
    )

    if (geminiAlias && geminiAlias.length > 3) {
      shortCode = geminiAlias
      aliasSource = "gemini"
      console.info(`${LOG_PREFIXES.LINKS} Gemini generated alias`, { shortCode })
    } else {
      shortCode = this.aliasGenerator.generateRandomAlias()
      aliasSource = "nanoid"
      console.warn(`${LOG_PREFIXES.LINKS} Gemini failed, using nanoid`, { shortCode })
    }

    // Check collision
    const exists = await this.repository.exists(shortCode)
    if (exists) {
      shortCode = `${shortCode}-${this.aliasGenerator.generateRandomAlias().slice(0, 3)}`
    }

    const link = await this.repository.create({
      userId,
      originalUrl,
      shortCode,
      requestId: null,
      aiStatus: "fallback",
    })

    console.info(`${LOG_PREFIXES.LINKS} Link created with fallback`, {
      linkId: link._id.toString(),
      shortCode,
      source: aliasSource,
    })

    return this.buildResponse(link, shortCode, aliasSource)
  }

  async getUserLinks(userId: string): Promise<Partial<LinkDocument>[]> {
    await connectDB()
    return this.repository.findByUserId(userId)
  }

  private buildResponse(
    link: LinkDocument,
    shortCode: string,
    source: "custom" | "ai" | "gemini" | "nanoid"
  ): CreateLinkResponse {
    return {
      id: link._id.toString(),
      requestId: link.requestId??"",
      originalUrl: link.originalUrl,
      shortUrl: `${API_CONFIG.BASE_URL}/r/${shortCode}`,
      shortCode,
      aiStatus: link.aiStatus,
      status: "created",
      aliasSource: source,
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConflictError"
  }
}