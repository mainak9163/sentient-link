import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { PasswordResetToken } from "@/models/password-reset-token"
import { hashPassword } from "@/lib/auth"
import { resetPasswordSchema } from "@/lib/validators/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "INVALID_INPUT",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    await connectDB()

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    })

    if (!resetToken) {
      return NextResponse.json(
        {
          code: "INVALID_OR_EXPIRED_TOKEN",
          message: "Invalid or expired reset link",
        },
        { status: 400 }
      )
    }

    const user = await User.findById(resetToken.userId)
    if (!user || !user.authProviders?.email) {
      return NextResponse.json(
        { message: "Invalid reset request" },
        { status: 400 }
      )
    }

    // ✅ Update password in the correct place
    user.authProviders.email.passwordHash = await hashPassword(password)
    await user.save()

    // ✅ Mark token as used
    resetToken.isUsed = true
    resetToken.usedAt = new Date()
    await resetToken.save()

    // 🔒 Optional: revoke all sessions
    // await Session.updateMany({ userId: user._id }, { revoked: true })

    return NextResponse.json({
      message: "Password reset successful",
    })
  } catch (err) {
    console.error("[RESET_PASSWORD_ERROR]", err)
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "Internal server error" },
      { status: 500 }
    )
  }
}
