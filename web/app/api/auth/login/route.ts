import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { Session } from "@/models/session"
import { verifyPassword } from "@/lib/auth"
import { signAccessToken, signRefreshToken } from "@/lib/jwt"
import { loginSchema } from "@/lib/validators/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1️⃣ Validate input
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "INVALID_INPUT",
          message: "Invalid email or password format",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    await connectDB()

    // 2️⃣ Find user
    const user = await User.findOne({ email })

    // 🚫 Do NOT leak account existence
    if (!user) {
      return NextResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    // 3️⃣ OAuth-only hardening
    if (!user.authProviders?.email) {
      return NextResponse.json(
        {
          code: "OAUTH_ONLY_ACCOUNT",
          message: "Please log in using your OAuth provider",
        },
        { status: 400 }
      )
    }

    const passwordHash = user.authProviders.email.passwordHash

    if (!passwordHash) {
      return NextResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    // 4️⃣ Email verification check
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          code: "EMAIL_NOT_VERIFIED",
          message: "Email not verified",
        },
        { status: 403 }
      )
    }

    // 5️⃣ Verify password
    const isValid = await verifyPassword(password, passwordHash)
    if (!isValid) {
      return NextResponse.json(
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    // 6️⃣ Issue tokens
    const accessToken = signAccessToken({
      userId: user._id.toString(),
    })

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
    })

    // 7️⃣ Persist session (hashed refresh token)
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")

    await Session.create({
      userId: user._id,
      refreshTokenHash,
      revoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    // 8️⃣ Respond + set cookie
    const response = NextResponse.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("[LOGIN_ERROR]", error)

    return NextResponse.json(
      {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    )
  }
}
