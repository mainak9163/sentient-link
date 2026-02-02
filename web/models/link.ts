import  { Schema, models, model } from "mongoose"

const LinkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
    },
requestId: {
  type: String,
  index: true,
},
aiStatus: {
  type: String,
  enum: ["pending", "completed", "failed", "fallback"],
  default: "pending",
},
aiResult: {
  type: Object,
},

  },
  { timestamps: true }
)

export const Link = models.Link || model("Link", LinkSchema)
