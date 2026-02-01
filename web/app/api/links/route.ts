import { NextResponse } from "next/server"
import crypto from "crypto"
import { nanoid } from "nanoid"
import { connectDB } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"
import { createLinkSchema } from "@/lib/validators/link"
import { runGemini } from "@/lib/gemini"
import { Types } from "mongoose"
import { Link } from "@/models/link"

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

interface AgentTriggerPayload {
  request_id: string | null
  job_type: "link_analysis"
  user_id: string
  link_id: string
  original_url: string
  user_intent: string
  context: Record<string, unknown>
}

interface AuthUser {
  userId: string
  email?: string
}


/* -------------------------------------------------------------------------- */
/*                                 AGENT CALL                                 */
/* -------------------------------------------------------------------------- */

async function triggerAgent(
  payload: AgentTriggerPayload
): Promise<boolean> {
  try {
    console.info("[AGENT] Triggering link analysis", {
      requestId: payload.request_id,
      linkId: payload.link_id,
    })

    await fetch(
      `${process.env.AGENT_API_URL}/api/v1/agent/analyze-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.INTERNAL_API_KEY!,
        },
        body: JSON.stringify(payload),
      }
    )

    console.info("[AGENT] Trigger successful", {
      linkId: payload.link_id,
    })

    return true
  } catch (error) {
    console.warn("[AGENT] Trigger failed — fallback path engaged", {
      error,
      linkId: payload.link_id,
    })

    return false
  }
}

/* -------------------------------------------------------------------------- */
/*                             GEMINI FALLBACK                                 */
/* -------------------------------------------------------------------------- */

async function geminiFallbackAlias(
  originalUrl: string,
  userIntent?: string
): Promise<string> {
  try {
    console.info("[GEMINI] Generating fallback alias")

    const prompt: string = `
Generate a short, URL-safe alias for the following link.

URL: ${originalUrl}
Intent: ${userIntent || "short link"}

Rules:
- lowercase
- hyphens only
- max 20 characters
- no explanations
Return ONLY the alias.
`

    const result: string = await runGemini(prompt)

    const alias: string = result
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 20)

    console.info("[GEMINI] Alias generated", { alias })

    return alias || nanoid(7)
  } catch (error) {
    console.error("[GEMINI] Fallback failed, using nanoid", error)
    return nanoid(7)
  }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  console.info("[LINKS] POST /api/links")

  const user: AuthUser | null = await getAuthUser()

  if (!user) {
    console.warn("[LINKS] Unauthorized request")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await req.json()
  const parsed = createLinkSchema.safeParse(body)

  if (!parsed.success) {
    console.warn("[LINKS] Validation failed", parsed.error.flatten())
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { originalUrl, customCode, userIntent } = parsed.data

  await connectDB()

  const hasCustomCode: boolean = Boolean(customCode)
  const fallbackCode: string = nanoid(7)
  let shortCode: string = customCode ?? fallbackCode

  const exists: LinkDocument | null = await Link.findOne({ shortCode })
  if (exists) {
    console.warn("[LINKS] Short code collision", { shortCode })
    return NextResponse.json(
      { message: "Short code already in use" },
      { status: 409 }
    )
  }

  const requestId: string | null =
    hasCustomCode ? null : crypto.randomUUID()

  const link: LinkDocument = await Link.create({
    userId: new Types.ObjectId(user.userId),
    originalUrl,
    shortCode,
    requestId,
    tags: [],
    riskScore: 0,
    aiStatus: hasCustomCode ? "skipped" : "pending",
  })

  if (!hasCustomCode) {
    const agentOk: boolean = await triggerAgent({
      request_id: requestId,
      job_type: "link_analysis",
      user_id: user.userId,
      link_id: link._id.toString(),
      original_url: originalUrl,
      user_intent: userIntent || "shorten link",
      context: {},
    })

    if (!agentOk) {
      const fallbackAlias: string = await geminiFallbackAlias(
        originalUrl,
        userIntent
      )

      await Link.updateOne(
        { _id: link._id },
        { shortCode: fallbackAlias, aiStatus: "fallback" }
      )

      shortCode = fallbackAlias
    }
  }

  return NextResponse.json({
    id: link._id.toString(),
    requestId: link.requestId,
    originalUrl,
    shortUrl: `${process.env.BASE_URL}/r/${shortCode}`,
    shortCode,
    aiStatus: link.aiStatus,
    status: "created",
  })
}

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export async function GET(): Promise<NextResponse> {
  console.info("[LINKS] GET /api/links")

  const user: AuthUser | null = await getAuthUser()
  if (!user) {
    console.warn("[LINKS] Unauthorized request")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const links: Pick<
    LinkDocument,
    "_id" | "originalUrl" | "shortCode" | "clicks" | "createdAt"
  >[] = await Link.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .select("_id originalUrl shortCode clicks createdAt")

  return NextResponse.json({ links })
}
