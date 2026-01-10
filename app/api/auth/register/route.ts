import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { hashPassword } from "@/lib/auth"
import { registerSchema } from "@/lib/validators/auth"

export async function POST(req: Request) {
  const body = await req.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data

  await connectDB()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)

  await User.create({
    email,
    passwordHash,
  })

  return NextResponse.json({ message: "User registered successfully" })
}
