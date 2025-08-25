export function removeRecipeFromOthersFavourites(users, recipeId) {
  users.forEach(async (user) => {
    if (user.favourites.includes(recipeId)) {
      user.favourites.filter((recipe) => {
        return recipe.toString() !== recipeId;
      });
      await user.save();
    }
  });
}
