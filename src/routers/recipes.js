import { Router } from 'express';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/upload.js';
import {
  getRecipesController,
  addRecipeToFavouritesController,
  createRecipeController,
  getOwnRecipesController,
  getFavouriteRecipesController,
  getRecipeByIdController,
  removeRecipeFromFavouritesController,
  deleteRecipeController,
} from '../controllers/recipes.js';

const router = Router();

router.get('/own', ctrlWrapper(getOwnRecipesController)); // ✅

router.get('/favourites', ctrlWrapper(getFavouriteRecipesController)); // ✅

router.patch('/favourites/:id', isValidId, ctrlWrapper(removeRecipeFromFavouritesController)); // ✅

router.get('/', ctrlWrapper(getRecipesController)); // ✅

router.post('/', upload.single('thumb'), validateBody(recipeSchema), ctrlWrapper(createRecipeController)); // ✅

router.get('/:id', isValidId, ctrlWrapper(getRecipeByIdController)); // ✅

router.patch('/:id', isValidId, ctrlWrapper(addRecipeToFavouritesController)); // ✅

router.delete('/:id', isValidId, ctrlWrapper(deleteRecipeController));

export default router;
