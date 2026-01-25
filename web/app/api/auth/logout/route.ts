import { NextResponse } from "next/server"
import crypto from "crypto"
import { cookies } from "next/headers"

import { connectDB } from "@/lib/db"
import { Session } from "@/models/session"

export async function POST() {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (refreshToken) {
      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

      // 🔒 Revoke session (idempotent & safe)
      await Session.updateMany(
        { refreshTokenHash },
        { revoked: true }
      )
    }

    const response = NextResponse.json({
      message: "Logged out successfully",
    })

    // ✅ Clear refresh token cookie
    response.cookies.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error)

    return NextResponse.json(
      {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
