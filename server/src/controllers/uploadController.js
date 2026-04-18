import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "Image file is required" });
    return;
  }

  if (hasCloudinaryConfig && req.query.provider === "cloudinary") {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "meesho-clone",
      resource_type: "image",
    });
    fs.unlink(req.file.path, () => {});
    res.status(201).json({ url: result.secure_url, publicId: result.public_id, provider: "cloudinary" });
    return;
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.status(201).json({
    url: `${baseUrl}/uploads/${req.file.filename}`,
    filename: req.file.filename,
    provider: "local",
  });
});
