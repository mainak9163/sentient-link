import { z } from "zod"

export const createLinkSchema = z.object({
  originalUrl: z.url("Invalid URL"),
  customCode: z.string().min(3).max(20).optional(),
  expiresAt: z.iso.datetime().optional(),
})
