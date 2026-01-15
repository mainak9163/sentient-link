import { EmailVerificationToken } from "@/models/email-verification-token"
import { generateToken } from "./tokens"
import mongoose from "mongoose"

export async function createEmailVerificationToken(userId: mongoose.Types.ObjectId) {
  const { token, tokenHash } = generateToken()

  await EmailVerificationToken.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  })

  return token
}
