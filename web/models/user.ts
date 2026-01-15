import mongoose, { Schema, Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId

  name: string
  email: string
  emailVerified: boolean

  avatarUrl?: string

  authProviders: {
    email?: {
      passwordHash: string
      verifiedAt?: Date
    }
    google?: {
      googleId: string
      email: string
    }
  }

  status: "active" | "suspended" | "deleted"

  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    avatarUrl: {
      type: String,
    },

    authProviders: {
      email: {
        passwordHash: { type: String },
        verifiedAt: { type: Date },
      },
      google: {
        googleId: { type: String },
        email: { type: String },
      },
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
