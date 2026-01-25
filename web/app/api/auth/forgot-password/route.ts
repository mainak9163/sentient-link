import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { PasswordResetToken } from "@/models/password-reset-token"
import { generateToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { code: "EMAIL_REQUIRED", message: "Email is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email })

    // 🔒 Never leak existence
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a password reset link has been sent",
      })
    }

    // 🚫 OAuth-only accounts cannot reset password
    if (!user.authProviders?.email) {
      return NextResponse.json({
        message:
          "If an account exists, a password reset link has been sent",
      })
    }

    // ⏱️ Basic rate limit (2 min)
    const recentToken = await PasswordResetToken.findOne({
      userId: user._id,
      isUsed: false,
      createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) },
    })

    if (recentToken) {
      return NextResponse.json({
        message:
          "A password reset email was sent recently. Please wait.",
      })
    }

    // Invalidate old tokens
    await PasswordResetToken.deleteMany({
      userId: user._id,
      isUsed: false,
    })

    const { token, tokenHash } = generateToken()

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })

    await sendPasswordResetEmail(user.email, token)

    return NextResponse.json({
      message:
        "If an account exists, a password reset link has been sent",
    })
  } catch (err) {
    console.error("[FORGOT_PASSWORD_ERROR]", err)
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "Internal server error" },
      { status: 500 }
    )
  }
}
