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

export async function getOwnRecipes(userId) {
  const recipes = recipesCollection.find({ owner: userId });
  return recipes;
}

export async function addToFavourites(recipeId, userId) {
  const user = await userModel.findById(userId);
  user.favourites.push(recipeId);
  await user.save();
  return user.favourites;
}

export async function removeFromFavourites(recipeId, userId) {
  const user = await userModel.findById(userId);
  user.favourites.filter((recipe) => {
    return recipe.toString() !== recipeId;
  });
  await user.save();
  return user.favourites;
}

export async function getFavouriteRecipes(userId) {
  const user = await userModel.findById(userId);
  const favouriteRecipes = recipesCollection.find({ _id: { $in: user.favourites } });
  return favouriteRecipes;
}
