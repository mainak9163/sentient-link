import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { verifyEmailToken } from "@/lib/verify-email"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json(
      { code: "TOKEN_MISSING", message: "Verification token missing" },
      { status: 400 }
    )
  }

  try {
    await connectDB()
    await verifyEmailToken(token)

    return NextResponse.json({
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error) {
    console.error("[VERIFY_EMAIL_ERROR]", error)

    return NextResponse.json(
      {
        code: "INVALID_OR_EXPIRED_TOKEN",
        message: "Invalid or expired verification link",
      },
      { status: 400 }
    )
  }
}
