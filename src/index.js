import { TMP_UPLOAD_DIR, UPLOAD_DIR } from './constans/index.js';

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';

createDirIfNotExists(TMP_UPLOAD_DIR);
createDirIfNotExists(UPLOAD_DIR);
initMongoConnection();
setupServer();
