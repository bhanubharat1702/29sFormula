import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: false,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

assetSchema.index({ storeId: 1, createdAt: -1 });

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

export default Asset;
