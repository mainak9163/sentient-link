import { Types } from "mongoose"
import { Link } from "@/models/link"
import type { LinkDocument, AIStatus } from "./types"

export class LinkRepository {
  async findByShortCode(shortCode: string): Promise<LinkDocument | null> {
    return Link.findOne({ shortCode })
  }

  async findByUserId(userId: string): Promise<Partial<LinkDocument>[]> {
    return Link.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select("_id originalUrl shortCode clicks createdAt")
      .lean()
  }

  async create(params: {
    userId: string
    originalUrl: string
    shortCode: string
    requestId: string | null
    aiStatus: AIStatus
  }): Promise<LinkDocument> {
    return Link.create({
      userId: new Types.ObjectId(params.userId),
      originalUrl: params.originalUrl,
      shortCode: params.shortCode,
      requestId: params.requestId,
      aiStatus: params.aiStatus,
      tags: [],
      riskScore: 0,
    })
  }

  async updateShortCode(
    linkId: Types.ObjectId,
    shortCode: string,
    aiStatus: AIStatus
  ): Promise<void> {
    await Link.updateOne(
      { _id: linkId },
      { shortCode, aiStatus }
    )
  }

  async exists(shortCode: string): Promise<boolean> {
    const count = await Link.countDocuments({ shortCode })
    return count > 0
  }
}