import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { EmailVerificationToken } from "@/models/email-verification-token"
import { sendVerificationEmail } from "@/lib/send-verification-email"


export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email })

    // ✅ SECURITY: do not leak user existence
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a verification email has been sent",
      })
    }

    // ✅ Already verified → no resend
    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified",
      })
    }

    // 1️⃣ Invalidate previous tokens
    await EmailVerificationToken.deleteMany({
      userId: user._id,
    })

    // 2️⃣ Create new token
    const rawToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    // 3️⃣ Send email
    const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${rawToken}`

    await sendVerificationEmail(user.email, verifyUrl)

    return NextResponse.json({
      message:
        "If an account exists, a verification email has been sent",
    })
  } catch (error) {
    console.error("[RESEND_VERIFICATION_ERROR]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
