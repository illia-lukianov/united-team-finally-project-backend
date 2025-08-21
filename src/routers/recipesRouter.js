import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getAllRecipesController } from "../controllers/recipes.js";

const recipesRouter = Router();
recipesRouter.get("/", ctrlWrapper(getAllRecipesController));

export default recipesRouter;
