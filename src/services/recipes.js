import { ingredientModel } from '../models/ingredient.js';
import { recipesCollection } from '../models/recipesModel.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getRecipes = async (params) => {
  const { page, perPage, categories, ingredients, searchQuery } = params;

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const query = recipesCollection.find();
  //   const query = recipesCollection.aggregate([
  //     {
  //       $lookup: {
  //         from: "ingredients",
  //         localField: "ingredients.id",
  //         foreignField: "_id",
  //         as: "ingredients",
  //       },
  //     },
  //     { $unset: "ingredients.id" },
  //   ]);

  if (categories.length !== 0) query.find({ category: { $in: categories } });

  if (ingredients.length !== 0) {
    const ingredientsIds = await ingredientModel
      .find({ name: { $in: ingredients } }, { _id: 1 })
      .lean()
      .then((ingredients) => ingredients.map((ingredient) => ingredient._id));

    //all from ingredients exist
    query.find({ 'ingredients.id': { $all: ingredientsIds } });

    //one from ingredients exist
    // query.find({
    //   ingredients: { $elemMatch: { id: { $in: ingredientsIds } } },
    // });
  }

  if (searchQuery.length !== 0) {
    const ppp = searchQuery.join(' ');
    console.log('ppp', ppp);

    query.find({
      $text: { $search: ppp },
    });
  }

  const totalRecipes = await recipesCollection.find().merge(query).countDocuments();

  const recipes = await query.skip(skip).limit(limit).populate({ path: 'ingredients.id', select: '-_id' }).exec();

  const paginationData = calculatePaginationData(totalRecipes, page, perPage);

  return { data: recipes, paginationData };
};
