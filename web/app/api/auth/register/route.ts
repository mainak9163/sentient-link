import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { connectDB } from "@/lib/db"
import { User } from "@/models/user"
import { registerSchema } from "@/lib/validators/auth"
import { createEmailVerificationToken } from "@/lib/create-email-verification"
import { sendVerificationEmail } from "@/lib/send-verification-email"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1️⃣ Validate input
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    await connectDB()

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      )
    }

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // 4️⃣ Create user (unverified)
    const user = await User.create({
      name,
      email,
      emailVerified: false,
      authProviders: {
        email: {
          passwordHash,
        },
      },
    })

    // 5️⃣ Create email verification token
    const token = await createEmailVerificationToken(user._id)

    // 6️⃣ Send verification email
    await sendVerificationEmail(user.email, token)

    // 7️⃣ Respond
    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER_ERROR]", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
