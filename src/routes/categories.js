import { Router } from "express";
import { fetchCategoriesController } from "../controllers/categories.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();
    router.get('/', ctrlWrapper(fetchCategoriesController));
export default router;