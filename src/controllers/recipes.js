import createHttpError from 'http-errors';
import { getRecipesWithFiltering, updateOwnRecipe } from '../services/recipes.js';
import getEnvVariables from '../utils/getEnvVariables.js';
import {
  addToFavourites,
  createRecipe,
  deleteRecipe,
  getFavouriteRecipes,
  getOwnRecipes,
  getRecipeById,
  removeFromFavourites,
} from '../services/recipes.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import uploadToStorage from '../utils/uploadToStorage.js';

export const getRecipesController = async (req, res) => {
  const result = await getRecipesWithFiltering([], req.query);

  res.json({
    status: 200,
    message: 'Successfully found recipes!',
    data: result,
  });
};

export async function getRecipeByIdController(req, res) {
  const recipe = await getRecipeById(req.params.id);

  if (!recipe) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Successfully got the recipe with id: ${req.params.recipeId}`,
    data: recipe,
  });
}

export async function createRecipeController(req, res) {
  let photoURL = null;

  if (req.file) {
    const UPLOAD_TO_CLOUDINARY = getEnvVariables('UPLOAD_TO_CLOUDINARY');

    if (UPLOAD_TO_CLOUDINARY === 'true') {
      photoURL = await uploadToCloudinary(req.file.path);
    } else {
      photoURL = await uploadToStorage(req.file);
    }
  }
  const recipe = await createRecipe({ ...req.body, owner: req.user.id, thumb: photoURL });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a recipe',
    data: recipe,
  });
}

export async function deleteRecipeController(req, res) {
  const recipe = await deleteRecipe(req.params.id, req.user.id);
  if (!recipe) throw createHttpError(404, 'Recipe not found');

  res.sendStatus(204);
}

export async function getOwnRecipesController(req, res) {
  const recipes = await getOwnRecipes(req.user.id, req.query);
  res.json({
    status: 200,
    message: 'Successfully fetched recipes',

    data: recipes,
  });
}

export async function updateOwnRecipeController(req, res) {
  let photoURL = null;

  if (req.file) {
    const UPLOAD_TO_CLOUDINARY = getEnvVariables('UPLOAD_TO_CLOUDINARY');

    if (UPLOAD_TO_CLOUDINARY === 'true') {
      photoURL = await uploadToCloudinary(req.file.path);
    } else {
      photoURL = await uploadToStorage(req.file);
    }
  }

  const updatedRecipe = await updateOwnRecipe(req.params.id, req.user.id, {
    ...req.body,
    thumb: photoURL ?? undefined,
  });
  if (!updatedRecipe) throw createHttpError(404, 'Recipe not found');
  res.json({
    status: 200,
    message: `Successfully updated recipe with id:${req.params.id}`,
    data: updatedRecipe,
  });
}

export async function addRecipeToFavouritesController(req, res) {
  const favouriteRecipe = await addToFavourites(req.params.id, req.user.id);

  res.json({
    status: 200,
    message: `Recipe with id: ${req.params.id} is successfully added to favourites`,
    data: favouriteRecipe,
  });
}

export async function removeRecipeFromFavouritesController(req, res) {
  const removedRecipe = await removeFromFavourites(req.params.id, req.user.id);

  res.json({
    status: 200,
    message: `Recipe with id: ${req.params.id} is successfully removed from favourites`,
    data: removedRecipe,
  });
}

export async function getFavouriteRecipesController(req, res) {
  const favouriteRecipes = await getFavouriteRecipes(req.user.id, req.query);

  res.json({
    status: 200,
    message: 'Successfully fetched favourite recipes',
    data: favouriteRecipes,
  });
}
