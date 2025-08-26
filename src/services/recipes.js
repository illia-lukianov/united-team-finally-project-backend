import { ingredientModel } from '../models/ingredient.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { normalizeRecipe, normalizeRecipeArray } from '../utils/normalizeRecipeFunc.js';
import { recipesCollection } from '../models/recipe.js';
import { userModel } from '../models/user.js';

export const getRecipes = async (params) => {
  const { page, perPage, categories = [], ingredients = [], searchQuery = '' } = params;

  const recipesQuery = recipesCollection.find();

  if (categories.length > 0) {
    recipesQuery.where({ category: { $in: categories } });
  }

  if (ingredients.length > 0) {
    recipesQuery.where({ 'ingredients.id': { $all: ingredients } });
  }

  if (searchQuery.trim() !== '') {
    recipesQuery.where({
      title: { $regex: searchQuery, $options: 'i' },
    });
  }

  const skip = (page - 1) * perPage;

  const totalRecipes = await recipesCollection.find().merge(recipesQuery).countDocuments();

  const limit = perPage;

  const recipes = await recipesQuery
    .skip(skip)
    .limit(limit)
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();
  const paginationData = calculatePaginationData(totalRecipes, page, perPage);

  return { data: normalizeRecipeArray(recipes), paginationData };
};

export async function getRecipeById(recipeId) {
  const recipe = await recipesCollection
    .findById(recipeId)
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();
  return normalizeRecipe(recipe);
}

export async function createRecipe(payload) {
  return recipesCollection.create(payload);
}

export async function deleteRecipe(recipeId, userId) {
  // const users = await userModel.find();
  // users.forEach(async (user) => {
  //   if (user.favourites.includes(recipeId)) {
  //     user.favourites.filter((recipe) => {
  //       return recipe.toString() !== recipeId;
  //     });
  //     await user.save();
  //   }
  // }); removeRecipeFromOthersFavourites
  return recipesCollection.findOneAndDelete({ _id: recipeId, owner: userId });
}

export async function getOwnRecipes(userId) {
  const recipes = await recipesCollection
    .find({ owner: userId })
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();
  return { items: normalizeRecipeArray(recipes) };
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
  const { favourites } = await userModel
    .findById(userId)
    .populate({
      path: 'favourites',
      select: '',
      populate: {
        path: 'ingredients.id',
        select: '-_id',
      },
    })
    .lean()
    .exec();

  return { items: normalizeRecipeArray(favourites) };
}
