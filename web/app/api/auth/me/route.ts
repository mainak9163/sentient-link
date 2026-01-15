import { NextResponse } from "next/server"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { verifyAccessToken } from "@/lib/jwt"
import { JwtPayload } from "jsonwebtoken"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    let payload: JwtPayload
    try {
      payload = verifyAccessToken(token)
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(payload.userId).select(
      "_id name email emailVerified createdAt"
    )

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("[ME_ERROR]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
