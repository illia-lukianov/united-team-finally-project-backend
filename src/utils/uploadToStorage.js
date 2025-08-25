import * as fs from "node:fs/promises"
import path from 'node:path';
import getEnvVariables from "./getEnvVariables.js";

export default async function uploadToStorage(photo) {
    await fs.rename(photo.path, path.resolve("src/uploads/photo", photo.filename));
    const domain = getEnvVariables("DOMAIN") ?? "http://localhost:8080";
    return photo = `${domain}/thumb/${photo.filename}`;
}