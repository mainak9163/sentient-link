import crypto from "crypto"
import bcrypt from "bcryptjs"
import { PasswordResetToken } from "@/models/password-reset-token"
import { User } from "@/models/user"
import { Session } from "@/models/session"

export async function resetPassword(
  rawToken: string,
  newPassword: string
) {
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")

  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })

  if (!record) {
    throw new Error("Invalid or expired token")
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await User.updateOne(
    { _id: record.userId },
    {
      "authProviders.email.passwordHash": passwordHash,
    }
  )

  // Invalidate all sessions
  await Session.updateMany(
    { userId: record.userId },
    { revoked: true }
  )

  record.usedAt = new Date()
  await record.save()
}
