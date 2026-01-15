import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { verifyPassword } from "@/lib/auth"
import { signAccessToken } from "@/lib/jwt"
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
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }

  const token = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
  })

  const response = NextResponse.json({ message: "Login successful" })

  response.cookies.set({
  name: "edge_token",
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 15 * 60, // 15 minutes
})

  
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}
