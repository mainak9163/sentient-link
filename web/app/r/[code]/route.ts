import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/link"

/**
 * GET /r/[code]
 * Redirect short URL to original URL and track clicks
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params

  console.info("[REDIRECT] Accessing short link", { code })

  await connectDB()

  // Find link by shortCode
  const link = await Link.findOne({ shortCode: code })

  if (!link) {
    console.warn("[REDIRECT] Link not found", { code })
    return NextResponse.redirect(
      new URL("/404", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    )
  }

  // Check expiry
  if (link.expiresAt && new Date() > link.expiresAt) {
    console.warn("[REDIRECT] Link expired", { code, expiresAt: link.expiresAt })
    return NextResponse.redirect(
      new URL("/expired", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    )
  }

  // Increment clicks asynchronously (don't block redirect)
  Link.updateOne(
    { _id: link._id },
    { $inc: { clicks: 1 } }
  )
    .then(() => {
      console.info("[REDIRECT] Click tracked", { code, clicks: link.clicks + 1 })
    })
    .catch((error) => {
      console.error("[REDIRECT] Failed to track click", { code, error })
    })

  console.info("[REDIRECT] Redirecting", {
    code,
    originalUrl: link.originalUrl,
    clicks: link.clicks,
  })

  // Redirect to original URL
  return NextResponse.redirect(link.originalUrl)
}