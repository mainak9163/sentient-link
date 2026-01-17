import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { Session } from "@/models/session"
import { verifyPassword } from "@/lib/auth"
import {
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt"
import { loginSchema } from "@/lib/validators/auth"

export async function POST(req: Request) {
  const body = await req.json()

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data

  await connectDB()

  const user = await User.findOne({ email })
  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  if (!user.emailVerified) {
  return NextResponse.json(
    {
      message: "Please verify your email before logging in",
    },
    { status: 403 }
  )
}

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  // 1️⃣ Create tokens
  const accessToken = signAccessToken({
    userId: user._id.toString(),
  })

  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
  })

  // 2️⃣ Store session
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex")

  await Session.create({
    userId: user._id,
    refreshTokenHash,
    revoked: false,
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  })

  // 3️⃣ Set cookie + return accessToken
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
}
