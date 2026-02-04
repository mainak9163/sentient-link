export const API_CONFIG = {
  AGENT: {
    URL: process.env.AGENT_API_URL,
    ENDPOINT: "/api/v1/agent/analyze-link",
    API_KEY: process.env.INTERNAL_API_KEY,
  },
  BASE_URL: process.env.BASE_URL,
  SHORT_CODE: {
    DEFAULT_LENGTH: 7,
    MAX_ALIAS_LENGTH: 20,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  VALIDATION_FAILED: "Validation failed",
  CODE_IN_USE: "Short code already in use",
  INTERNAL_ERROR: "Internal server error",
} as const

export const LOG_PREFIXES = {
  LINKS: "[LINKS]",
  AGENT: "[AGENT]",
  GEMINI: "[GEMINI]",
} as const

export const GEMINI_PROMPT_TEMPLATE = `
Generate a short, URL-safe alias for the following link.

URL: {{url}}
Intent: {{intent}}

Rules:
- lowercase
- hyphens only
- max 20 characters
- no explanations
Return ONLY the alias.
`