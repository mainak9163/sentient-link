import mongoose from "mongoose"
import { EmailVerificationToken } from "@/models/email-verification-token"
import { generateToken } from "./tokens"

export async function createEmailVerificationToken(
  userId: mongoose.Types.ObjectId
) {
  const { token, tokenHash } = generateToken()

  //  Invalidate all previous unused tokens
  await EmailVerificationToken.deleteMany({
    userId,
    isUsed: false,
  })

  await EmailVerificationToken.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  })

  return token
}
