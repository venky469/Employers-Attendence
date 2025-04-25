import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload image to Cloudinary
export const uploadImage = async (imageString: string, folder = "labour-attendance"): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imageString, {
      folder,
    })
    return result.secure_url
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    throw new Error("Image upload failed")
  }
}

// Delete image from Cloudinary
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from the URL
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0]
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw new Error("Image deletion failed")
  }
}

export default cloudinary
