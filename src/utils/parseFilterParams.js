const parseArray = (arr) => {
  if (typeof arr === 'string') return arr.split(',');
  if (Array.isArray(arr))
    return arr
      .join(',')
      .split(',')
      .filter((e) => typeof e === 'string');
  return [];
};

export const parseFilterParams = (query) => {
  const categories = query.categories ?? query['categories[]'];
  const ingredients = query.ingredients ?? query['ingredients[]'];
  const { searchQuery } = query;

  const parsedSearchQuery = typeof searchQuery === 'string' ? searchQuery : '';
  const parsedCategories = parseArray(categories);
  const parsedIngredients = parseArray(ingredients);

  return {
    searchQuery: parsedSearchQuery,
    categories: parsedCategories,
    ingredients: parsedIngredients,
  };
};
