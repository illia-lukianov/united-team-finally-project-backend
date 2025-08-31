export const normalizeRecipeArray = (recipeArray = []) => {
  return recipeArray.map((recipe) => {
    return {
      ...recipe,
      ingredients: (recipe.ingredients || []).map(({ measure, id }) => ({
        measure,
        ...id,
      })),
    };
  });
};

export const normalizeRecipe = (recipe) => ({
  ...recipe,
  ingredients: recipe.ingredients.map(({ measure, id }) => ({
    measure,
    ... id,
  })),
});