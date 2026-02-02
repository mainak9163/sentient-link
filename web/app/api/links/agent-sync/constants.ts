export const AGENT_CONFIG = {
  API_URL: process.env.AGENT_API_URL,
  API_KEY: process.env.INTERNAL_API_KEY,
  RESULT_ENDPOINT: "/api/v1/agent/result",
} as const

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  MISSING_LINK_ID: "Missing linkId",
  LINK_NOT_FOUND: "Link not found",
  INTERNAL_ERROR: "Internal server error",
} as const

export const LOG_PREFIXES = {
  AGENT_SYNC: "[AGENT-SYNC]",
  AGENT_CLIENT: "[AGENT-CLIENT]",
} as const

export const SYNC_STATUS = {
  NO_AGENT: "no-agent",
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const