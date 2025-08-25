import fs from 'node:fs/promises';
import cloudinary from 'cloudinary';
import getEnvVariables from './getEnvVariables.js';

cloudinary.v2.config({
  cloud_name: getEnvVariables('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVariables('CLOUDINARY_API_KEY'),
  api_secret: getEnvVariables('CLOUDINARY_API_SECRET'),
});

export default async function uploadToCloudinary(path) {
  const response = await cloudinary.v2.uploader.upload(path, {
    folder: 'Go-it-finally-project'
  });
  await fs.unlink(path);
  return response.secure_url;
}
