import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./constants";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file: File | any, folder: string) => {
  try {
    const result = await uploadImage(file, folder);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadImage = async (file: File | any, folder: string) => {
  try {
    let fileToUpload = file;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileToUpload = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: `apna-campus/${folder}`,
    });
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteFile = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
