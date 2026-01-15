import mongoose, { Schema, Types } from "mongoose"

export interface ISession {
  _id: Types.ObjectId

  userId: Types.ObjectId
  refreshTokenHash: string

  ip?: string
  userAgent?: string

  revoked: boolean
  expiresAt: Date

  createdAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
    },

    ip: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    revoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Session =
  mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema)
