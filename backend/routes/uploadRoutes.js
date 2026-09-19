import express from "express";
import { Readable } from "stream";
import { cloudinary, upload, deleteFromCloudinary } from "../utils/cloudinary.js";

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

    // Set up Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "29sformula",
        timeout: 120000
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream upload failed:", error);
          return res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
        }
        res.json({ url: result.secure_url });
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
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    await deleteFromCloudinary(url);
    res.json({ message: "Asset deleted successfully from Cloudinary" });
  } catch (error) {
    console.error("Delete asset failed:", error);
    res.status(500).json({ error: error.message || "Failed to delete asset from Cloudinary" });
  }
});

export default router;
