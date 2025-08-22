import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getRecipesController } from '../controllers/recipes.js';

const recipesRouter = Router();
recipesRouter.get('/', ctrlWrapper(getRecipesController));

export default recipesRouter;
