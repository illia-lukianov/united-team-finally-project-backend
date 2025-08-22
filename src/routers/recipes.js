import { Router } from 'express';

import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  addRecipeToFavouritesController,
  createRecipeController,
  getAllRecipesController,
  getFavouriteRecipesController,
  removeRecipeFromFavouritesController,
} from '../controllers/recipes.controller.js';

const router = Router();

router.get('/:recipeId', isValidId, ctrlWrapper());

router.post(
  '/own',
  validateBody(recipeSchema),
  ctrlWrapper(createRecipeController),
);

router.get('/own/:owner', ctrlWrapper(getAllRecipesController));

router.patch(
  '/favourites/:recipeId',
  isValidId,
  ctrlWrapper(addRecipeToFavouritesController),
);

router.patch(
  '/favourites/:recipeId',
  isValidId,
  ctrlWrapper(removeRecipeFromFavouritesController),
);

router.get(
  '/favourites',
  isValidId,
  ctrlWrapper(getFavouriteRecipesController),
);

export default router;
