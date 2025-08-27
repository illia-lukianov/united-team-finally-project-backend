import path from 'node:path';

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const TMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'tmp');
export const UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads');
