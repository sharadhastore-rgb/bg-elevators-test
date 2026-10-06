import mongoose, { Schema } from "mongoose";
import {
  leadStatuses,
  careerStatuses,
  leadSources,
  teamRoles,
} from "./constants";
export {
  leadStatuses,
  careerStatuses,
  leadSources,
  teamRoles,
} from "./constants";
const person = {
  name: { type: String, required: true, trim: true, maxlength: 256 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 256,
  },
  phone: { type: String, required: true, trim: true, maxlength: 25 },
};
const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 256 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: teamRoles, default: "admin" },
    active: { type: Boolean, default: true },
    sessionVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const leadSchema = new Schema(
  {
    ...person,
    location: { type: String, default: "", maxlength: 256 },
    page: { type: String, default: "", maxlength: 512 },
    message: { type: String, default: "", maxlength: 5000 },
    source: { type: String, enum: leadSources, default: "Website" },
    status: { type: String, enum: leadStatuses, default: "New" },
    favorite: { type: Boolean, default: false },
    adminNote: { type: String, default: "", maxlength: 10000 },
  },
  { timestamps: true },
);
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ favorite: -1, createdAt: -1 });
const careerSchema = new Schema(
  {
    ...person,
    location: { type: String, default: "", maxlength: 256 },
    page: { type: String, default: "", maxlength: 512 },
    position: { type: String, default: "General Application", maxlength: 256 },
    experience: { type: String, default: "", maxlength: 256 },
    message: { type: String, default: "", maxlength: 5000 },
    resume: {
      filename: String,
      contentType: String,
      data: { type: Buffer, select: false },
      externalUrl: String,
    },
    status: { type: String, enum: careerStatuses, default: "New" },
    adminNote: { type: String, default: "", maxlength: 10000 },
  },
  { timestamps: true },
);
careerSchema.index({ createdAt: -1 });
careerSchema.index({ status: 1, createdAt: -1 });
const activitySchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ["lead", "career", "team"],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    entityName: { type: String, default: "" },
    action: { type: String, required: true },
    description: { type: String, required: true },
    actorId: Schema.Types.ObjectId,
    actorName: { type: String, default: "Website" },
    actorRole: { type: String, default: "website" },
    changes: [{ _id: false, field: String, before: String, after: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
activitySchema.index({ createdAt: -1 });
activitySchema.index({ entityType: 1, createdAt: -1 });
const brochureSchema = new Schema(
  {
    filename: { type: String, required: true, maxlength: 256 },
    contentType: { type: String, default: "application/pdf" },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false },
    active: { type: Boolean, default: true, index: true },
    uploadedById: Schema.Types.ObjectId,
    uploadedByName: { type: String, required: true, maxlength: 256 },
  },
  { timestamps: true },
);
brochureSchema.index({ createdAt: -1 });
export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
export const CareerApplication =
  mongoose.models.CareerApplication ||
  mongoose.model("CareerApplication", careerSchema);
export const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export const Brochure =
  mongoose.models.Brochure || mongoose.model("Brochure", brochureSchema);
