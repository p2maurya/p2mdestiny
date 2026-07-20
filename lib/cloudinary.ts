import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload a base64/data-url or remote file url to Cloudinary
export async function uploadToCloudinary(file: string, folder: string, resourceType: "image" | "video" = "image") {
  const result = await cloudinary.uploader.upload(file, {
    folder: `p2mdestiny/${folder}`,
    resource_type: resourceType,
  });
  return result.secure_url;
}
