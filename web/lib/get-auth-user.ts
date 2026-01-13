import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"

export async function getAuthUser() {
  const token = (await cookies()).get("token")?.value
  if (!token) return null

  try {
    return verifyToken(token)
  } catch {
    return null
  }
}
