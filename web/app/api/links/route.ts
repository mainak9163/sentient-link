import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/link"
import { createLinkSchema } from "@/lib/validators/link"
import { getAuthUser } from "@/lib/get-auth-user"
import { nanoid } from "nanoid"

/**
 * CREATE SHORT LINK
 * POST /api/links
 */
export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user || typeof user === "string") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createLinkSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { originalUrl, customCode, expiresAt } = parsed.data

  await connectDB()

  const shortCode = customCode ?? nanoid(7)

  const exists = await Link.findOne({ shortCode })
  if (exists) {
    return NextResponse.json(
      { message: "Short code already in use" },
      { status: 409 }
    )
  }

  const link = await Link.create({
    userId: user.userId,
    originalUrl,
    shortCode,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  })

  return NextResponse.json({
    shortUrl: `${process.env.BASE_URL}/r/${link.shortCode}`,
    link,
  })
}

/**
 * GET ALL LINKS (FOR LOGGED-IN USER)
 * GET /api/links
 */
export async function GET() {
  const user = await getAuthUser()
  if (!user || typeof user === "string") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const links = await Link.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .select("_id originalUrl shortCode clicks createdAt")

  return NextResponse.json({ links })
}
