export const FORM_CONSTANTS = {
  PLACEHOLDERS: {
    URL: "https://example.com",
    ALIAS: "my-custom-link",
    INTENT: "share resume with recruiters",
  },
  LABELS: {
    ORIGINAL_URL: "Original URL",
    CUSTOM_ALIAS: "Use custom alias",
    CUSTOM_CODE: "Custom short code",
    INTENT: "Purpose / Intent",
  },
  DESCRIPTIONS: {
    CUSTOM_ENABLED: "Custom aliases skip AI analysis",
    CUSTOM_DISABLED: "AI can suggest a more meaningful alias",
    ALIAS_RULES: "Lowercase letters, numbers, and hyphens only.",
    INTENT_HELP: "Helps AI generate a better alias.",
  },
  VALIDATION: {
    ALIAS_PATTERN: "[a-z0-9-]+",
  },
} as const

export const TOAST_MESSAGES = {
  SUCCESS: "Short link created",
  ERROR: "Something went wrong",
  CLIPBOARD: "Copied to clipboard",
} as const

export const BADGE_TEXT = {
  AI_ASSISTED: "AI Assisted",
  INSTANT: "Instant",
} as const