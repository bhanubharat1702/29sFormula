import express from "express";
import mongoose from "mongoose";
import { Readable } from "stream";
import { cloudinary, upload, deleteFromCloudinary, getCloudinaryResourceType } from "../utils/cloudinary.js";
import Asset from "../models/Asset.js";

const router = express.Router();

router.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (process.env.CLOUDINARY_API_SECRET?.includes("*")) {
      return res.status(400).json({ error: "Cloudinary API Secret is currently masked with asterisks ('**********'). Please update backend/.env with your actual unmasked Cloudinary API Secret." });
    }

    if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
      return res.status(400).json({ error: "Cloudinary credentials not configured in backend .env file" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const effectiveStoreId = req.storeId || "superadmin";
    const folder = `store-engine/tenant_${effectiveStoreId}`;

    // Set up Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
        timeout: 120000
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary stream upload failed:", error);
          return res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
        }

        try {
          const asset = await Asset.create({
            url: result.secure_url || result.url,
            publicId: result.public_id,
            storeId: req.storeId || null
          });

          return res.json({
            assetId: asset._id,
            url: asset.url,
            publicId: asset.publicId,
            storeId: asset.storeId
          });
        } catch (dbError) {
          console.error("Failed to save asset metadata to database:", dbError);
          return res.status(500).json({ error: "Failed to save asset metadata to database" });
        }
      }
    );

    // Stream the buffer to Cloudinary
    Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
  }
});

router.post("/api/upload/delete", async (req, res) => {
  try {
    const { assetId } = req.body;
    if (!assetId) {
      return res.status(400).json({ error: "assetId is required" });
    }

    if (!req.storeId) {
      return res.status(400).json({ error: "Tenant context (storeId) is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({ error: "Invalid assetId format" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    if (String(asset.storeId) !== String(req.storeId)) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to delete this asset" });
    }

    const resourceType = getCloudinaryResourceType(asset.url);
    try {
      await cloudinary.uploader.destroy(asset.publicId, { resource_type: resourceType });
    } catch (destroyError) {
      console.error(`Cloudinary destroy failed for ${asset.publicId}:`, destroyError);
    }

    await Asset.findByIdAndDelete(assetId);

    return res.json({ message: "Asset deleted successfully from Cloudinary and database" });
  } catch (error) {
    console.error("Delete asset failed:", error);
    res.status(500).json({ error: error.message || "Failed to delete asset" });
  }
});

export default router;
