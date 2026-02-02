import { Types } from "mongoose"

export type AgentStatus = "no-agent" | "pending" | "processing" | "completed" | "failed"

export interface LinkDocument {
  _id: Types.ObjectId
  userId: Types.ObjectId
  requestId: string | null
  shortCode: string
  customAlias?: boolean
  aiStatus: string
  aiResult?: AgentResultData
  tags?: string[]
  riskScore?: number
  save(): Promise<LinkDocument>
}

export interface AgentResultData {
  suggested_alias?: string
  tags?: string[]
  risk_score?: number
  [key: string]: unknown
}

export interface AgentApiResponse {
  status: AgentStatus
  result?: AgentResultData
}

export interface SyncResponse {
  status: AgentStatus
  result?: AgentResultData
}

export interface AuthUser {
  userId: string
  email?: string
}

export interface SyncLinkParams {
  linkId: string
  userId: string
}