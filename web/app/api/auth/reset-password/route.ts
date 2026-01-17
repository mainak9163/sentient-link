import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { PasswordResetToken } from "@/models/password-reset-token"
import { hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      )
    }

    await connectDB()

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    })

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      )
    }

    const user = await User.findById(resetToken.userId)
    if (!user) {
      return NextResponse.json(
        { message: "Invalid reset request" },
        { status: 400 }
      )
    }

    user.passwordHash = await hashPassword(password)
    await user.save()

    await PasswordResetToken.deleteMany({ userId: user._id })

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (err) {
    console.error("[RESET_PASSWORD_ERROR]", err)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
