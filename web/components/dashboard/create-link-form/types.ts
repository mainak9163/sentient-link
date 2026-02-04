export interface FormState {
  originalUrl: string
  customCode: string
  userIntent: string
  useCustomAlias: boolean
}

export interface CreateLinkPayload {
  originalUrl: string
  customCode?: string
  userIntent?: string
}

export type AliasSource = "custom" | "ai" | "gemini" | "nanoid"

export interface CreateLinkResponse {
  id: string
  shortUrl: string
  shortCode: string
  aliasSource: AliasSource  // NEW: indicates how alias was generated
  requestId?: string | null
  aiStatus?: string
}

export interface AgentResult {
  suggested_alias?: string
  tags?: string[]
  risk_score?: number
  reasoning?: string
  [key: string]: unknown
}

export type AgentStatus = "idle" | "processing" | "completed" | "error"