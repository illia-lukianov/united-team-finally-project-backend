import express from "express";
import cors from "cors";
import pino from "pino-http";
import "dotenv/config";
import getEnvVariables from "./utils/getEnvVariables.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import router from "./routers/index.js";
import cookieParser from "cookie-parser";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";
import authRoutes from "./routers/auth.js";

const PORT = getEnvVariables("PORT") ?? "3000";

export default function setupServer() {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
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
  app.use(cookieParser());
  app.use("/auth", authRoutes);
  app.use("/api-docs", swaggerDocs());
  app.use(router);
  app.use(errorHandler);
  app.use(notFoundHandler);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}
