import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectDB } from "@/lib/db"
import { Session } from "@/models/session"

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie")

    if (cookieHeader) {
      const refreshTokenMatch = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("refreshToken="))

      if (refreshTokenMatch) {
        const refreshToken = refreshTokenMatch.split("=")[1]

        const refreshTokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex")

        await connectDB()

        // Revoke session (safe even if already revoked)
        await Session.updateOne(
          { refreshTokenHash },
          { revoked: true }
        )
      }
    }

    // Always clear cookie
    const response = NextResponse.json({
      message: "Logged out successfully",
    })

    response.cookies.set("edge_token", "", {
  maxAge: 0,
  path: "/",
})


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
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
