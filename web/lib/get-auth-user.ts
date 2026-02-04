"use server"
import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/jwt"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"

export async function getAuthUser() {
  try {
    const token = (await cookies()).get("accessToken")?.value

    if (!token) {
      console.info("[AUTH] No auth token in cookies")
      return null
    }

    const payload = verifyAccessToken(token)

    await connectDB()

    const user = await User.findById(payload.userId).select(
      "_id name email emailVerified createdAt"
    )

    if (!user) {
      console.warn("[AUTH] Token valid but user not found", {
        userId: payload.userId,
      })
      return null
    }

    console.info("[AUTH] Auth user resolved", {
      userId: user._id.toString(),
    })

    return {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.warn("[AUTH] Failed to resolve auth user", error)
    return null
  }
}
