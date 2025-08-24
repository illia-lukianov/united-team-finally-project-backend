import fs from 'node:fs/promises';
import cloudinary from 'cloudinary';
import getEnvVariables from './getEnvVariables.js';

cloudinary.v2.config({
  cloud_name: getEnvVariables('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVariables('CLOUDINARY_API_KEY'),
  api_secret: getEnvVariables('CLOUDINARY_API_SECRET'),
});

export default async function uploadToCloudinary(file) {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
}
