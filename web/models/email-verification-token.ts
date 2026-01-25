import mongoose, { Schema, Types } from "mongoose"

export interface IEmailVerificationToken {
  _id: Types.ObjectId
  userId: Types.ObjectId
  tokenHash: string

  expiresAt: Date
  isUsed: boolean
  usedAt?: Date

  createdAt: Date
}

const EmailVerificationTokenSchema = new Schema<IEmailVerificationToken>(
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
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },

    usedAt: {
      type: Date,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// TTL cleanup (Mongo will auto-delete expired docs)
EmailVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

export const EmailVerificationToken =
  mongoose.models.EmailVerificationToken ||
  mongoose.model<IEmailVerificationToken>(
    "EmailVerificationToken",
    EmailVerificationTokenSchema
  )
