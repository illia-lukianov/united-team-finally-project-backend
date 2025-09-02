import calculatePaginationData from '../utils/calculatePaginationData.js';
import { normalizeRecipe } from '../utils/normalizeRecipeFunc.js';
import { recipesCollection } from '../models/recipe.js';
import { userModel } from '../models/user.js';
import mongoose from 'mongoose';
import { parseFilterParams, parsePaginationParams, parseSortParams } from '../utils/parseQueryParams.js';
import { sessionModel } from '../models/session.js';

export const getRecipes = async (startQuery = [], params = null) => {
  const query = [...startQuery];

  query.push(
    {
      $lookup: {
        from: 'ingredients',
        localField: 'ingredients.id',
        foreignField: '_id',
        as: 'ingredientsData',
      },
    },
    {
      $addFields: {
        ingredients: {
          $map: {
            input: '$ingredients',
            as: 'ing',
            in: {
              $mergeObjects: [
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$ingredientsData',
                        as: 'ingData',
                        cond: { $eq: ['$$ingData._id', '$$ing.id'] },
                      },
                    },
                    0,
                  ],
                },
                '$$ing',
              ],
            },
          },
        },
      },
    },
    { $unset: ['ingredients.id', 'ingredientsData'] },
  );

  if (params !== null) {
    const { page, perPage } = parsePaginationParams(params);
    const limit = perPage;
    const skip = (page - 1) * perPage;
    query.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    });
  }

  const recipes = await recipesCollection.aggregate(query).exec();
  let result = { ...recipes[0] };
  if (params !== null) {
    const { page, perPage } = parsePaginationParams(params);
    const totalRecipes = recipes[0].totalCount[0]?.count || 0;
    const paginationData = calculatePaginationData(totalRecipes, page, perPage);
    result = { items: recipes[0].data, ...paginationData };
  }

  return result;
};

export const getRecipesWithFiltering = async (startQuery = [], params) => {
  const { categories = [], ingredients = [], searchQuery = '' } = parseFilterParams(params);
  const { sortBy = '', sortOrder } = parseSortParams(params);

  const query = [...startQuery];

  if (categories.length !== 0) query.push({ $match: { category: { $in: categories } } });

  if (ingredients.length !== 0) query.push({ $match: { 'ingredients.id': { $all: ingredients } } });

  if (searchQuery.length !== 0) query.push({ $match: { title: { $regex: searchQuery, $options: 'i' } } });

  if (sortBy.length !== 0) query.push({ $sort: { [sortBy]: sortOrder } });

  const result = await getRecipes(query, params);
  return result;
};

export async function getRecipeById(recipeId) {
  const query = [{ $match: { _id: new mongoose.Types.ObjectId(String(recipeId)) } }];
  return await getRecipes(query);
}

export async function createRecipe(payload) {
  const session = await sessionModel.findOne({ userId: payload.owner });
  return recipesCollection.create({...payload, area: session.userArea});
}

export async function deleteRecipe(recipeId, userId) {
  const session = await mongoose.startSession();
  let deletedRecipe = null;
  await session.withTransaction(async () => {
    deletedRecipe = await recipesCollection.findOneAndDelete({ _id: recipeId, owner: userId }, { session });
    if (!deletedRecipe) throw createHttpError(404, 'Recipe not found or you are not the owner');
    await userModel.updateMany({ favourites: recipeId }, { $pull: { favourites: recipeId } }, { session });
  });

  session.endSession();
  return deleteRecipe;
}

export async function getOwnRecipes(userId, params) {
  const query = [{ $match: { owner: new mongoose.Types.ObjectId(String(userId)) } }];
  return await getRecipesWithFiltering(query, params);
}

export async function updateOwnRecipe(recipeId, userId, payload) {
  const updatedRecipe = await recipesCollection
    .findOneAndUpdate(
      { _id: recipeId, owner: userId },
      { $set: payload },
      {
        new: true,
      },
    )
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();
  return normalizeRecipe(updatedRecipe);
}

export async function addToFavourites(recipeId, userId) {
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { favourites: recipeId } },
    { new: true, fields: { favourites: 1, _id: 0 } },
  );
  if (!user) throw createHttpError(404, 'User not found');

  await recipesCollection.findByIdAndUpdate(
    recipeId,
    { $inc: { popularity: 1 } },
    { new: true }
  );

  const recipe = await recipesCollection
    .findById(recipeId)
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();

  return normalizeRecipe(recipe);
}

export async function removeFromFavourites(recipeId, userId) {
  await userModel.findByIdAndUpdate(userId, { $pull: { favourites: recipeId } }, { new: true });
  const recipe = await recipesCollection
    .findById(recipeId)
    .populate({ path: 'ingredients.id', select: '-_id' })
    .lean()
    .exec();

  await recipesCollection.findByIdAndUpdate(
    recipeId,
    { $inc: { popularity: -1 } },
    { new: true }
  );

  return normalizeRecipe(recipe);
}

export async function getFavouriteRecipes(userId, params) {
  const { favourites } = await userModel.findById(userId, { favourites: 1, _id: 0 });

  const query = [{ $match: { _id: { $in: favourites } } }];
  return await getRecipesWithFiltering(query, params);
}
