import { Router } from 'express';
import ingredientsRoute from './ingredients.js';
import categoriesRoute from './categories.js';
import recipesRoute from './recipes.js';

const router = Router();

router.use('/ingredients', ingredientsRoute);
router.use('/categories', categoriesRoute);
router.use('/recipes', recipesRoute);

export default router;
