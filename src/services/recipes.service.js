import { recipesCollection } from '../models/recipe.js';
import { userModel } from '../models/user.js';

export async function getRecipeById(recipeId) {
  const recipe = recipesCollection.findById(recipeId);
  return recipe;
}

export async function createRecipe(payload) {
  const recipe = recipesCollection.create(payload);
  return recipe;
}

export async function getOwnRecipes(owner) {
  const recipes = recipesCollection.find({ owner });
  return recipes;
}

export async function addToFavourites(recipeId, userId) {
  const user = await userModel.findById(userId);
  user.favourites.push(recipeId);
  return user.favourites;
}

export async function removeFromFavourites(recipeId, userId) {
  const user = await userModel.findById(userId);
  user.favourites.filter((recipe) => recipe !== recipeId);
  return user.favourites;
}

export async function getFavouriteRecipes(userId) {
  const user = await userModel.findById(userId);
  const favouriteRecipes = recipesCollection.find({ _id: { $in: user.favourites } });
  return favouriteRecipes;
}
