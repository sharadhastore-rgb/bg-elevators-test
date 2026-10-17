import mongoose, { Schema } from "mongoose";
export const ConfiguratorSetting =
  mongoose.models.ConfiguratorSetting ||
  mongoose.model(
    "ConfiguratorSetting",
    new Schema(
      {
        key: { type: String, unique: true },
        settings: Schema.Types.Mixed,
        revision: { type: Number, default: 0 },
        updatedBy: String,
      },
      { timestamps: true },
    ),
  );
export const ConfiguratorRequest =
  mongoose.models.ConfiguratorRequest ||
  mongoose.model(
    "ConfiguratorRequest",
    new Schema(
      {
        customer: Schema.Types.Mixed,
        specification: Schema.Types.Mixed,
        selections: Schema.Types.Mixed,
        revision: Number,
        status: String,
        consent: Boolean,
        marketing: Boolean,
        drawing: {
          data: { type: Buffer, select: false },
          contentType: String,
          filename: String,
        },
      },
      { timestamps: true },
    ),
  );
export const ConfiguratorAsset =
  mongoose.models.ConfiguratorAsset ||
  mongoose.model(
    "ConfiguratorAsset",
    new Schema({ data: Buffer, contentType: String }, { timestamps: true }),
  );
