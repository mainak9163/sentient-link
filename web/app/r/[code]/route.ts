import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Link } from "@/models/link"

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params

  await connectDB()

  const link = await Link.findOne({ shortCode: code })

  if (!link) {
    return NextResponse.redirect(new URL("/", process.env.WEB_URL!))
  }

  // Expiry check
  if (link.expiresAt && new Date() > link.expiresAt) {
    return NextResponse.redirect(new URL("/", process.env.WEB_URL!))
  }

  // Increment clicks (non-blocking)
  Link.updateOne(
    { _id: link._id },
    { $inc: { clicks: 1 } }
  ).catch(() => {})

  return NextResponse.redirect(link.originalUrl)
}
