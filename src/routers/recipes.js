import { Router } from 'express';

import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/upload.js';

import {
  addRecipeToFavouritesController,
  createRecipeController,
  getOwnRecipesController,
  getFavouriteRecipesController,
  getRecipeByIdController,
  removeRecipeFromFavouritesController,
} from '../controllers/recipes.controller.js';

const router = Router();

router.get('/:id', isValidId, ctrlWrapper(getRecipeByIdController));

router.post('/', upload.single('thumb'), validateBody(recipeSchema), ctrlWrapper(createRecipeController));

router.get('/', ctrlWrapper(getOwnRecipesController));

router.patch('/:id', isValidId, ctrlWrapper(addRecipeToFavouritesController));

router.patch('/favourites/:id', isValidId, ctrlWrapper(removeRecipeFromFavouritesController));

router.get('/favourites', isValidId, ctrlWrapper(getFavouriteRecipesController));

export default router;
