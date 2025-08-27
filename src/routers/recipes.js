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
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/own', auth, ctrlWrapper(getOwnRecipesController)); // ✅

router.get('/favourites', auth, ctrlWrapper(getFavouriteRecipesController)); // ✅

router.delete('/favourites/:id', auth, isValidId, ctrlWrapper(removeRecipeFromFavouritesController)); // ✅

router.get('/', ctrlWrapper(getRecipesController)); // ✅

router.post('/', auth, upload.single('thumb'), validateBody(recipeSchema), ctrlWrapper(createRecipeController)); // ✅

router.get('/:id', isValidId, ctrlWrapper(getRecipeByIdController)); // ✅

router.post('/favourites/:id', auth, isValidId, ctrlWrapper(addRecipeToFavouritesController)); // ✅

router.delete('/:id', auth, isValidId, ctrlWrapper(deleteRecipeController));

export default router;
