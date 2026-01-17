import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { Session } from "@/models/session"
import { verifyGoogleIdToken } from "@/lib/google"
import {
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json()

    if (!idToken) {
      return NextResponse.json(
        { message: "Missing Google token" },
        { status: 400 }
      )
    }

    // 1️⃣ Verify Google token
    const googleUser = await verifyGoogleIdToken(idToken)

    await connectDB()

    // 2️⃣ Find existing user
    let user = await User.findOne({
      $or: [
        { "authProviders.google.googleId": googleUser.googleId },
        { email: googleUser.email },
      ],
    })

    // 3️⃣ Create or link user
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        emailVerified: true,
        authProviders: {
          google: {
            googleId: googleUser.googleId,
            email: googleUser.email,
          },
        },
      })
    } else {
      // Link Google provider if not linked
      if (!user.authProviders?.google) {
        user.authProviders.google = {
          googleId: googleUser.googleId,
          email: googleUser.email,
        }
        user.emailVerified = true
        await user.save()
      }
    }

    // 4️⃣ Create tokens
    const accessToken = signAccessToken({
      userId: user._id.toString(),
    })

    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
    })

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")

    // 5️⃣ Store session
    await Session.create({
      userId: user._id,
      refreshTokenHash,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    })

    // 6️⃣ Response + cookies
    const response = NextResponse.json({
      message: "Google login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })

    // refresh token
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
    console.error("[GOOGLE_AUTH_ERROR]", error)
    return NextResponse.json(
      { message: "Google authentication failed" },
      { status: 401 }
    )
  }
}
