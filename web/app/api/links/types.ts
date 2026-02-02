import { Types } from "mongoose"

export type AIStatus = "pending" | "completed" | "failed" | "fallback" | "skipped"

export interface LinkDocument {
  _id: Types.ObjectId
  userId: Types.ObjectId
  originalUrl: string
  shortCode: string
  clicks: number
  expiresAt?: Date
  requestId?: string | null
  aiStatus: AIStatus
  aiResult?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  userId: string
  email?: string
}

export interface AgentTriggerPayload {
  request_id: string | null
  job_type: "link_analysis"
  user_id: string
  link_id: string
  original_url: string
  user_intent: string
  context: Record<string, unknown>
}

export interface CreateLinkRequest {
  originalUrl: string
  customCode?: string
  userIntent?: string
}

export interface CreateLinkResponse {
  id: string
  requestId: string | null
  originalUrl: string
  shortUrl: string
  shortCode: string
  aiStatus: AIStatus
  status: "created"
  aliasSource:string
}

export interface GetLinksResponse {
  links: Array<{
    _id: Types.ObjectId
    originalUrl: string
    shortCode: string
    clicks: number
    createdAt: Date
  }>
}