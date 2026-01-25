import { NextResponse } from "next/server"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { EmailVerificationToken } from "@/models/email-verification-token"
import { createEmailVerificationToken } from "@/lib/create-email-verification"
import { sendVerificationEmail } from "@/lib/send-verification-email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        {
          code: "EMAIL_REQUIRED",
          message: "Email is required",
        },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email })

    // 🔒 SECURITY: never leak existence
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists, a verification email has been sent",
      })
    }

    // 🚫 OAuth-only accounts should NOT receive verification emails
    if (!user.authProviders?.email) {
      return NextResponse.json(
        {
          code: "OAUTH_ONLY_ACCOUNT",
          message:
            "This account uses OAuth and does not require email verification",
        },
        { status: 400 }
      )
    }

    // ✅ Already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified",
      })
    }

    // ⏱️ Basic resend throttling (anti-spam)
    const recentToken = await EmailVerificationToken.findOne({
      userId: user._id,
      isUsed: false,
      createdAt: {
        $gt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes
      },
    })

    if (recentToken) {
      return NextResponse.json({
        message:
          "A verification email was sent recently. Please wait before retrying.",
      })
    }

    // 1️⃣ Create fresh token (old ones invalidated internally)
    const token = await createEmailVerificationToken(user._id)

    // 2️⃣ Send verification email
    await sendVerificationEmail(user.email, token)

    return NextResponse.json({
      message:
        "If an account exists, a verification email has been sent",
    })
  } catch (error) {
    console.error("[RESEND_VERIFICATION_ERROR]", error)

    return NextResponse.json(
      {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}