import calculatePaginationData from '../utils/calculatePaginationData.js';
import { normalizeRecipe, normalizeRecipeArray } from '../utils/normalizeRecipeFunc.js';
import { recipesCollection } from '../models/recipe.js';
import { userModel } from '../models/user.js';
import mongoose from 'mongoose';
import { parseFilterParams, parsePaginationParams, parseSortParams } from '../utils/parseQueryParams.js';

export const getRecipes = async (startQuery = [], params = null) => {
  const query = [...startQuery];

  //Populate 😎
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
    { $unset: ['ingredients.id', 'ingredients._id', 'ingredientsData'] },
  );

  const { page, perPage } = parsePaginationParams(params);
  if (params !== null) {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    query.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    });
  }

  console.log('query', query);
  const recipes = await recipesCollection.aggregate(query).exec();

  const totalRecipes = recipes[0].totalCount[0]?.count || 0;
  const paginationData = calculatePaginationData(totalRecipes, page, perPage);

  return { data: recipes[0].data, paginationData };
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

// export const getRecipes = async (params) => {
//   const { page, perPage, categories = [], ingredients = [], searchQuery = '', sortOrder, sortBy } = params;

//   const recipesQuery = recipesCollection.find();

//   if (categories.length > 0) {
//     recipesQuery.where({ category: { $in: categories } });
//   }

//   if (ingredients.length > 0) {
//     recipesQuery.where({ 'ingredients.id': { $all: ingredients } });
//   }

//   if (searchQuery !== '') {
//     recipesQuery.where({
//       title: { $regex: searchQuery, $options: 'i' },
//     });
//   }

//   const skip = (page - 1) * perPage;

//   const totalRecipes = await recipesCollection.find().merge(recipesQuery).countDocuments();

//   const limit = perPage;

//   const recipes = await recipesQuery
//     .sort({ [sortBy]: sortOrder })
//     .skip(skip)
//     .limit(limit)
//     .populate({ path: 'ingredients.id', select: '-_id' })
//     .lean()
//     .exec();
//   const paginationData = calculatePaginationData(totalRecipes, page, perPage);

//   return { data: normalizeRecipeArray(recipes), paginationData };
// };

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
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const deletedRecipe = await recipesCollection.findOneAndDelete({ _id: recipeId, owner: userId }, { session });
    if (!deletedRecipe) throw createHttpError(404, 'Recipe not found or you are not the owner');
    await userModel.updateMany({ favourites: recipeId }, { $pull: { favourites: recipeId } }, { session });
  });

  session.endSession();
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
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { favourites: recipeId } },
    { new: true, fields: { favourites: 1, _id: 0 } },
  );
  if (!user) throw createHttpError(404, 'User not found');
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
  return normalizeRecipe(recipe);
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
