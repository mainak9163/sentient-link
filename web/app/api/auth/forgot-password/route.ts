import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { PasswordResetToken } from "@/models/password-reset-token"
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email"


export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" })
    }

    await connectDB()

    const user = await User.findOne({ email })

    // 🔐 Do not leak user existence
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a password reset link has been sent",
      })
    }

    // Invalidate old tokens
    await PasswordResetToken.deleteMany({ userId: user._id })

    const rawToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
    })

    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${rawToken}`

    await sendPasswordResetEmail(user.email, resetUrl)

    return NextResponse.json({
      message:
        "If an account exists, a password reset link has been sent",
    })
  } catch (err) {
    console.error("[FORGOT_PASSWORD_ERROR]", err)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
