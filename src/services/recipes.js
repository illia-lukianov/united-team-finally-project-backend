import { ingredientModel } from '../models/ingredient.js';
import { recipesCollection } from '../models/recipe.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { normalizeRecipeArray } from '../utils/normalizeRecipeFunc.js';

export const getRecipes = async (params) => {
  const { page, perPage, categories, ingredients, searchQuery } = params;

  const query = recipesCollection.find();

  if (categories.length !== 0) query.find({ category: { $in: categories } });

  if (ingredients.length !== 0) {
    const ingredientsIds = await ingredientModel
      .find({ name: { $in: ingredients } }, { _id: 1 })
      .lean()
      .then((ingredients) => ingredients.map((ingredient) => ingredient._id));

    query.find({ 'ingredients.id': { $all: ingredientsIds } });
  }

  if (searchQuery.length !== 0) {
    query.find({
      title: { $regex: searchQuery, $options: 'i' },
    });
  }

  const limit = perPage;
  const skip = (page - 1) * perPage;
  const totalRecipes = await recipesCollection.find().merge(query).countDocuments();

  const recipes = (await query.skip(skip).limit(limit).populate({ path: 'ingredients.id', select: '-_id' }).lean().exec())

  const paginationData = calculatePaginationData(totalRecipes, page, perPage);

  return { data: normalizeRecipeArray(recipes), paginationData };
};
