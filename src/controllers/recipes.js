import { getRecipes } from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getRecipesController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const filterParams = parseFilterParams(req.query);
  console.log('filterParams', filterParams);

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
