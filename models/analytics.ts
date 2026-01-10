import mongoose, { Schema, models, model } from "mongoose"

const AnalyticsSchema = new Schema(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    ip: String,
    userAgent: String,
    country: String,
  },
  { timestamps: true }
)

export const Analytics =
  models.Analytics || model("Analytics", AnalyticsSchema)
