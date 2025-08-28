import {
  migrateCalValue,
  migrateIngredientsId,
  migrateTime,
  migrateUserFields,
} from "../migrationMongo.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import setupServer from "./server.js";

await initMongoConnection();
setupServer();
//await migrateTime();
