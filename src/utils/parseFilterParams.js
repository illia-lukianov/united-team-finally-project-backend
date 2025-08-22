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
  const { searchQuery, categories, ingredients } = query;

  const parsedSearchQuery = parseArray(searchQuery);
  const parsedCategories = parseArray(categories);
  const parsedIngredients = parseArray(ingredients);

  return {
    searchQuery: parsedSearchQuery,
    categories: parsedCategories,
    ingredients: parsedIngredients,
  };
};
