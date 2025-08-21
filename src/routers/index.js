import { Router } from "express";
import ingredientsRoute from "./ingredients.js";
import categoriesRoute from "./categories.js";
import recipesRouter from "./recipesRouter.js";

const router = Router();
router.use("/ingredients", ingredientsRoute);
router.use("/categories", categoriesRoute);
router.use("/recipes", recipesRouter);
export default router;
