import mongoose, { Schema, Types } from "mongoose"

const PasswordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    usedAt: {
      type: Date,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

PasswordResetTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

export const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", PasswordResetTokenSchema)
