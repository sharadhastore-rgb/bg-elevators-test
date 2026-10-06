import mongoose, { Schema } from "mongoose";
const schema = new Schema(
  {
    title: { type: String, required: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, maxlength: 120 },
    excerpt: { type: String, required: true, maxlength: 320 },
    content: { type: String, required: true, maxlength: 100000 },
    category: { type: String, default: "Elevator insights", maxlength: 60 },
    imageAlt: { type: String, default: "", maxlength: 180 },
    seoTitle: { type: String, default: "", maxlength: 70 },
    seoDescription: { type: String, default: "", maxlength: 170 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: Date,
    routePath: { type: String, maxlength: 130 },
    structuredBody: Schema.Types.Mixed,
    structuredHeadings: Schema.Types.Mixed,
    additionalSections: Schema.Types.Mixed,
    importSource: String,
    cover: {
      data: { type: Buffer, select: false },
      contentType: String,
      thumbnailData: { type: Buffer, select: false },
      thumbnailContentType: String,
    },
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true, optimisticConcurrency: true },
);
schema.index({ status: 1, publishedAt: -1 });
schema.index({ updatedAt: -1, _id: -1 });
schema.index({ status: 1, updatedAt: -1, _id: -1 });
export const Blog = mongoose.models.Blog || mongoose.model("Blog", schema);
