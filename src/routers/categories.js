import { Router } from "express";
import { fetchCategoriesController } from "../controllers/categories.js";

const router = Router();
    router.get('/', fetchCategoriesController);
export default router;