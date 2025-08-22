import { Router } from 'express';

import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  addRecipeToFavouritesController,
  createRecipeController,
  getOwnRecipesController,
  getFavouriteRecipesController,
  getRecipeByIdController,
  removeRecipeFromFavouritesController,
} from '../controllers/recipes.controller.js';

const router = Router();

router.get('/:recipeId', isValidId, ctrlWrapper(getRecipeByIdController));

router.post('/own', validateBody(recipeSchema), ctrlWrapper(createRecipeController));

router.get('/own/:owner', ctrlWrapper(getOwnRecipesController));

router.patch('/:recipeId', isValidId, ctrlWrapper(addRecipeToFavouritesController));

router.patch('/favourites/:recipeId', isValidId, ctrlWrapper(removeRecipeFromFavouritesController));

router.get('/favourites', isValidId, ctrlWrapper(getFavouriteRecipesController));

export default router;
