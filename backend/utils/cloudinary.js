import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 120000
  });
} else {
  cloudinary.config({
    secure: true,
    timeout: 120000
  });
}

// Configure Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Helper to extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    let publicIdWithExt = parts[1];
    if (publicIdWithExt.startsWith("v")) {
      const slashIndex = publicIdWithExt.indexOf("/");
      if (slashIndex !== -1) {
        publicIdWithExt = publicIdWithExt.substring(slashIndex + 1);
      }
    }
    
    
    const dotIndex = publicIdWithExt.lastIndexOf(".");
    if (dotIndex !== -1) {
      return publicIdWithExt.substring(0, dotIndex);
    }
    return publicIdWithExt;
  } catch (e) {
    console.error("Failed to parse Cloudinary URL public_id:", e);
    return null;
  }
};

// Helper to determine Cloudinary resource type
const getCloudinaryResourceType = (url) => {
  if (!url) return "image";
  return url.includes("/video/") ? "video" : "image";
};

// Helper to delete an asset from Cloudinary
const deleteFromCloudinary = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;

  const resourceType = getCloudinaryResourceType(url);
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Cloudinary deletion success for ${publicId} (${resourceType}):`, result);
  } catch (error) {
    console.error(`Cloudinary deletion failed for ${publicId}:`, error);
  }
};

export { cloudinary, upload, deleteFromCloudinary, getCloudinaryPublicId, getCloudinaryResourceType };
