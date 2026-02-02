import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/get-auth-user"
import { createLinkSchema } from "@/lib/validators/link"
import { LinkService } from "./link.service"
import { ErrorHandler } from "./error-handler"
import { LOG_PREFIXES } from "./constants"
import type { AuthUser } from "./types"

const linkService = new LinkService()

/**
 * POST /api/links
 * Create a new short link
 */
export async function POST(req: Request): Promise<NextResponse> {
  console.info(`${LOG_PREFIXES.LINKS} POST /api/links`)

  try {
    // Authenticate user
    const user: AuthUser | null = await getAuthUser()
    if (!user) {
      return ErrorHandler.unauthorized()
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = createLinkSchema.parse(body)

    // Create link
    const result = await linkService.createLink(user.userId, validatedData)

    return NextResponse.json(result)
  } catch (error) {
    return ErrorHandler.handle(error)
  }
}

/**
 * GET /api/links
 * Retrieve all links for the authenticated user
 */
export async function GET(): Promise<NextResponse> {
  console.info(`${LOG_PREFIXES.LINKS} GET /api/links`)

  try {
    // Authenticate user
    const user: AuthUser | null = await getAuthUser()
    if (!user) {
      return ErrorHandler.unauthorized()
    }

    // Fetch user's links
    const links = await linkService.getUserLinks(user.userId)

    return NextResponse.json({ links })
  } catch (error) {
    return ErrorHandler.handle(error)
  }
}