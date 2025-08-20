import { Router } from "express";
import { fetchIngredientsController } from "../controllers/ingredients.js";

const router = Router();
router.get('/', fetchIngredientsController)
export default router;