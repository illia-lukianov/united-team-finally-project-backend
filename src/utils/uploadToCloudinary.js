import cloudinary from 'cloudinary';
import getEnvVariables from './getEnvVariables.js';

cloudinary.v2.config({
  cloud_name: getEnvVariables('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVariables('CLOUDINARY_API_KEY'),
  api_secret: getEnvVariables('CLOUDINARY_API_SECRET'),
});

export function uploadToCloudinary(filePath) {
  return cloudinary.v2.uploader.upload(filePath);
}