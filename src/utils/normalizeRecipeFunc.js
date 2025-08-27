export const normalizeRecipeArray = (recipeArray) =>
  recipeArray.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map(({ measure, id }) => ({
      measure,
      ... id,
    })),
  }));

export const normalizeRecipe = (recipe) => ({
  ...recipe,
  ingredients: recipe.ingredients.map(({ measure, id }) => ({
    measure,
    ... id,
  })),
});