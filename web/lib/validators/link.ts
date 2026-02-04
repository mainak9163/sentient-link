import { z } from "zod"

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .url("Invalid URL"),

  customCode: z
    .string()
    .min(3, "Custom code must be at least 3 characters")
    .max(20, "Custom code must be at most 20 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed")
    .optional(),

  expiresAt: z
    .iso
    .datetime()
    .optional(),

  // 🔹 Used by agent (optional, but very useful)
  userIntent: z
    .string()
    .min(3, "Intent too short")
    .max(200, "Intent too long")
    .optional(),
})

export type CreateLinkPayload = z.infer<typeof createLinkSchema>
