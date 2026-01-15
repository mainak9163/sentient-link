import { NextResponse } from "next/server"

import { connectDB } from "@/lib/db"
import { verifyEmailToken } from "@/lib/verify-email"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { message: "Verification token missing" },
        { status: 400 }
      )
    }

    await connectDB()

    // 1️⃣ Verify token (hash, expiry, one-time use)
    await verifyEmailToken(token)

    // 2️⃣ Success response
    return NextResponse.json({
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error) {
    console.error("[VERIFY_EMAIL_ERROR]", error)

    return NextResponse.json(
      { message: "Invalid or expired verification link" },
      { status: 400 }
    )
  }
}
