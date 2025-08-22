import createHttpError from 'http-errors';
import { getRecipes } from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllRecipesController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query); //page, perPage
  const filterParams = parseFilterParams(req.query); //categories, ingredients
  console.log('filterParams', filterParams);

  const result = await getRecipes({ ...paginationParams, ...filterParams });

  if (result.data.length === 0) throw createHttpError(404, 'No matches found');

  res.json({
    status: 200,
    message: 'Successfully found recipes!',
    data: result.data,
    ...result.paginationData,
  });
};
