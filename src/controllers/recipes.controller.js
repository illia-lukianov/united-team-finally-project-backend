import createHttpError from 'http-errors';

import getEnvVariables from '../utils/getEnvVariables.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

import {
  addToFavourites,
  createRecipe,
  getFavouriteRecipes,
  getOwnRecipes,
  getRecipeById,
  removeFromFavourites,
} from '../services/recipes.service.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export async function getRecipeByIdController(req, res) {
  console.log(req.params.recipeId);

  const recipe = await getRecipeById(req.params.recipeId);

  if (!recipe) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Successfully got the recipe with id: ${req.params.recipeId}`,
    data: recipe,
  });
}

export async function createRecipeController(req, res) {
  const photo = req.file;
  let photoURL;

  if (photo) {
    if (getEnvVariables('UPLOAD_TO_CLOUDINARY') === true) {
      photoURL = await uploadToCloudinary(photo);
    } else {
      photoURL = await saveFileToUploadDir(photo);
    }
  }

  const recipe = await createRecipe({ ...req.body, owner: req.user.id, thumb: photoURL });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a recipe',
    data: recipe,
  });
}

export async function getOwnRecipesController(req, res) {
  const recipes = await getOwnRecipes(req.user.id);

  if (!recipes) throw createHttpError(404, 'Recipes not found');

  res.json({
    status: 200,
    message: 'Successfully fetched recipes',
    data: recipes,
  });
}

export async function addRecipeToFavouritesController(req, res) {
  const favourites = await addToFavourites(req.params.id, req.user.id);

  if (!favourites) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Recipe with id: ${req.params.id} is successfully added to favourites`,
    data: favourites,
  });
}

export async function removeRecipeFromFavouritesController(req, res) {
  const favourites = await removeFromFavourites(req.params.id, req.user.id);

  if (!favourites) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Recipe with id: ${req.params.id} is successfully removed from favourites`,
    data: favourites,
  });
}

export async function getFavouriteRecipesController(req, res) {
  const recipes = await getFavouriteRecipes(req.user.id);

  res.json({
    status: 200,
    message: 'Successfully fetched favourite recipes',
    data: recipes,
  });
}
