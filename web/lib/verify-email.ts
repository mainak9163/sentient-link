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
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  })

  if (!record) {
    throw new Error("Invalid or expired token")
  }

  await User.updateOne(
    { _id: record.userId },
    {
      emailVerified: true,
      "authProviders.email.verifiedAt": new Date(),
    }
  )

  record.usedAt = new Date()
  await record.save()
}
