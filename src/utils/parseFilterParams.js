const parseArray = (arr) => {
  if (typeof arr === 'string' && arr.length > 0) return arr.split(',');
  if (Array.isArray(arr))
    return arr
      .join(',')
      .split(',')
      .filter((e) => typeof e === 'string' && e.length > 0);
  return [];
};

export const parseFilterParams = (query) => {
  const categories = query.categories ?? query['categories[]'];
  const ingredients = query.ingredients ?? query['ingredients[]'];
  const { searchQuery } = query;

  const parsedSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : '';
  const parsedCategories = parseArray(categories);
  const parsedIngredients = parseArray(ingredients);
  // console.log('parsedCategories', parsedCategories);
  // console.log('parsedIngredients', parsedIngredients);

  return {
    searchQuery: parsedSearchQuery,
    categories: parsedCategories,
    ingredients: parsedIngredients,
  };
};
