import fs from 'node:fs/promises';
import path from 'node:path';

import getEnvVariables from '../utils/getEnvVariables.js';
import { TMP_UPLOAD_DIR, UPLOAD_DIR } from '../constans/index.js';

export async function saveFileToUploadDir(file) {
  await fs.rename(path.join(TMP_UPLOAD_DIR, file.filename), path.join(UPLOAD_DIR, file.filename));

  return `${getEnvVariables('APP_DOMAIN')}/uploads/${file.filename}`;
}
