import { PasswordResetToken } from "@/models/password-reset-token"
import { generateToken } from "./tokens"
import mongoose from "mongoose"

export async function createPasswordResetToken(
  userId: mongoose.Types.ObjectId
) {
  const { token, tokenHash } = generateToken()

  await PasswordResetToken.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  })

  return token
}
