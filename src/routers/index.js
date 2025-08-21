import { Router } from "express";
import ingredientsRoute from "./ingredients.js";
import categoriesRoute from "./categories.js";

const router = Router();
router.use("/ingredients", ingredientsRoute);
router.use("/categories", categoriesRoute);
export default router;
