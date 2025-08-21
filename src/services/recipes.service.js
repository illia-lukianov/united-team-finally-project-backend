import { recipeCollection } from '../db/models/recipes.js';

export async function createRecipe(payload) {
  const recipe = recipeCollection.create(payload);
  return recipe;
}

export async function getAllRecipes(ownerId) {
  const recipes = recipeCollection.find({ ownerId });
  return recipes;
}

export async function addToFavourites(recipeId) {
  const recipe = recipeCollection.findOneAndUpdate(recipeId, {
    isFavourite: true,
  });
  return recipe;
}

export async function removeFromFavourites(recipeId) {
  const recipe = recipeCollection.findOneAndUpdate(recipeId, {
    isFavourite: false,
  });
  return recipe;
}

export async function getAllFavourites(isFavourite) {
  const recipes = recipeCollection.find({ isFavourite });
  return recipes;
}
