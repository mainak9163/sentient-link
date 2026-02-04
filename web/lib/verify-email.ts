import crypto from "crypto"
import { EmailVerificationToken } from "@/models/email-verification-token"
import { User } from "@/models/user"

export async function verifyEmailToken(rawToken: string) {
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")

  const record = await EmailVerificationToken.findOne({
    tokenHash,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  })

  if (!record) {
    throw new Error("Invalid or expired token")
  }

  const user = await User.findById(record.userId)
  if (!user) {
    throw new Error("User not found")
  }

  // 🔁 Idempotent: already verified
  if (user.emailVerified) {
    record.isUsed = true
    record.usedAt = new Date()
    await record.save()
    return
  }

  // ✅ Verify user
  user.emailVerified = true
  user.authProviders.email.verifiedAt = new Date()
  await user.save()

  // ✅ Mark token used
  record.isUsed = true
  record.usedAt = new Date()
  await record.save()
}
