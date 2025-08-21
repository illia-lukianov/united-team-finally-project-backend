const parseArray = (arr) => {
  if (typeof arr === "string") return arr.split(",");
  if (Array.isArray(arr)) return arr.filter((e) => typeof e === "string");
  return [];
};

export const parseFilterParams = (query) => {
  const { categories, ingredients } = query;

  const parsedCategories = parseArray(categories);
  const parsedIngredients = parseArray(ingredients);

  return {
    categories: parsedCategories,
    ingredients: parsedIngredients,
  };
};
