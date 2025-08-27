import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import getEnvVariables from './utils/getEnvVariables.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';
import path from 'node:path';

const PORT = getEnvVariables("PORT") ?? "3000";
const allowedOrigins = [
'http://localhost:5173',
'https://united-team-finally-project-front-e.vercel.app',
];

export default function setupServer() {
  const app = express();

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, origin || '*'); // дозволяє будь-який домен
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
      level: "error",
    })
  );
  app.use('/auth/uploads', express.static(UPLOAD_DIR));
  app.use(cookieParser());
  app.use("/api-docs", swaggerDocs());
  app.use('/thumb', express.static(path.resolve('src/uploads/photo')));
  app.use(router);
  app.use(errorHandler);
  app.use(notFoundHandler);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
