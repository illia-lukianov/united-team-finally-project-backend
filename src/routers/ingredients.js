import { Router } from "express";
import { fetchIngredientsController } from "../controllers/ingredients.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();
router.get('/', ctrlWrapper(fetchIngredientsController))
export default router;