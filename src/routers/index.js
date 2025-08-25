import { Router } from 'express';
import ingredientsRoute from './ingredients.js';
import categoriesRoute from './categories.js';
import recipesRoute from './recipes.js';
import { getUserInfoController } from '../controllers/users.js';

const router = Router();
router.use('/ingredients', ingredientsRoute);
router.use('/categories', categoriesRoute);
router.use('/recipes', recipesRoute);
router.get('/users', getUserInfoController);
export default router;
