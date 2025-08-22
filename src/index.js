import { initMongoConnection } from "./db/initMongoConnection.js";
import setupServer from "./server.js";

initMongoConnection()
  .then(() => {
    console.log("Mongo connected");
  })
  .then(setupServer);
