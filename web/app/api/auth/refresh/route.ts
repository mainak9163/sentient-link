import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { Session } from "@/models/session"
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/jwt"
import { JwtPayload } from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    // 1️⃣ Read refresh token from cookie
    const cookieHeader = req.headers.get("cookie")
    if (!cookieHeader) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const refreshTokenMatch = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("refreshToken="))

    if (!refreshTokenMatch) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const refreshToken = refreshTokenMatch.split("=")[1]

    // 2️⃣ Verify refresh token signature
    let payload: JwtPayload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      )
    }

    await connectDB()

    // 3️⃣ Hash refresh token
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")

    // 4️⃣ Find valid session
    const session = await Session.findOne({
      userId: payload.userId,
      refreshTokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    })

    if (!session) {
      return NextResponse.json(
        { message: "Session expired" },
        { status: 401 }
      )
    }

    // 5️⃣ Rotate tokens
    const newAccessToken = signAccessToken({
      userId: payload.userId,
    })

    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
    })

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex")

    // 6️⃣ Update session
    session.refreshTokenHash = newRefreshTokenHash
    session.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )
    await session.save()

    // 7️⃣ Set new refresh token cookie
    const response = NextResponse.json({
      accessToken: newAccessToken,
    })
    
    response.cookies.set({
  name: "edge_token",
  value: newAccessToken,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 15 * 60,
})


    response.cookies.set({
      name: "refreshToken",
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("[REFRESH_ERROR]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
