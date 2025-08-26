import createHttpError from 'http-errors';
import { getRecipes } from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import getEnvVariables from '../utils/getEnvVariables.js';
import path from 'node:path';
import {
  addToFavourites,
  createRecipe,
  deleteRecipe,
  getFavouriteRecipes,
  getOwnRecipes,
  getRecipeById,
  removeFromFavourites,
} from '../services/recipes.js';
import { normalizeRecipe } from '../utils/normalizeRecipeFunc.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import uploadToStorage from '../utils/uploadToStorage.js';
import fs from 'node:fs/promises';

export const getRecipesController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const filterParams = parseFilterParams(req.query);

  const result = await getRecipes({ ...paginationParams, ...filterParams });

  res.json({
    status: 200,
    message: 'Successfully found recipes!',
    data: {
      items: [...result.data],
      ...result.paginationData,
    },
  });
};

export async function getRecipeByIdController(req, res) {
  const recipe = await getRecipeById(req.params.id);

  if (!recipe) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Successfully got the recipe with id: ${req.params.recipeId}`,
    data: normalizeRecipe(recipe),
  });
}

export async function createRecipeController(req, res) {
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };

  let photoURL = null;

  console.log('🚀 ~ createRecipeController ~ req.file:', req.file);
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
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };
  const recipe = await deleteRecipe(req.params.id, req.user.id);
  if (!recipe) throw createHttpError(404, 'Recipe not found');

  res.sendStatus(204);
}

export async function getOwnRecipesController(req, res) {
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };

  const recipes = await getOwnRecipes(req.user.id);
  res.json({
    status: 200,
    message: 'Successfully fetched recipes',
    data: {
      ...recipes,
    },
  });
}

export async function addRecipeToFavouritesController(req, res) {
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };
  const receipeId = req.params.id;
  const favourites = await addToFavourites(req.params.id, req.user.id);
  const matches = favourites.filter((q) => q.equals(receipeId)).length;

  switch (matches) {
    case 0:
      throw createHttpError(404, 'Recipe not found');
    case 1:
      res.json({
        status: 200,
        message: `Recipe with id: ${req.params.id} is successfully added to favourites`,
        data: req.params.id,
      });
      break;
    default:
      throw createHttpError(409, 'Recipe already exists');
  }
}

export async function removeRecipeFromFavouritesController(req, res) {
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };
  const favourites = await removeFromFavourites(req.params.id, req.user.id);

  if (!favourites) throw createHttpError(404, 'Recipe not found');

  res.json({
    status: 200,
    message: `Recipe with id: ${req.params.id} is successfully removed from favourites`,
    data: favourites,
  });
}

export async function getFavouriteRecipesController(req, res) {
  req.user = {
    id: '64c8d958249fae54bae90bb9',
  };
  const favouriteRecipes = await getFavouriteRecipes(req.user.id);

  res.json({
    status: 200,
    message: 'Successfully fetched favourite recipes',
    data: favouriteRecipes,
  });
}
