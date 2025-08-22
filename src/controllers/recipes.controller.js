import {
  addToFavourites,
  createRecipe,
  getAllFavourites,
  getAllRecipes,
  removeFromFavourites,
} from '../services/recipes.service.js';

export async function createRecipeController(req, res) {
  const recipe = await createRecipe({ ...req.body, owner: req.user.id });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a recipe',
    data: recipe,
  });
}

export async function getAllRecipesController(req, res) {
  const recipes = await getAllRecipes(req.params.owner);

  res.json({
    status: 200,
    message: 'Successfully fetched recipes',
    data: recipes,
  });
}

export async function addRecipeToFavouritesController(req, res) {
  const recipe = await addToFavourites(req.params.id);

  res.json({
    status: 200,
    message: 'Successfully added recipe to favourites',
    data: recipe,
  });
}

export async function removeRecipeFromFavouritesController(req, res) {
  const recipe = await removeFromFavourites(req.params.id);

  res.json({
    status: 200,
    message: 'Successfully removed recipe from favourites',
    data: recipe,
  });
}

export async function getFavouriteRecipesController(req, res) {
  const recipes = await getAllFavourites();

  res.json({
    status: 200,
    message: 'Successfully fetched favourite recipes',
    data: recipes,
  });
}
