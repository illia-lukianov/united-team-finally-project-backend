import { Router } from 'express';
import ingredientsRoute from './ingredients.js';
import categoriesRoute from './categories.js';
import recipesRoute from './recipes.js';
import authRoute from './auth.js';
import { getUserInfoController } from '../controllers/users.js';
import { auth } from '../middlewares/auth.js';

const router = Router();
router.use('/ingredients', ingredientsRoute);
router.use('/categories', categoriesRoute);
router.use('/recipes', recipesRoute);
router.get('/current', auth, getUserInfoController);
router.use('/auth', authRoute);
export default router;
