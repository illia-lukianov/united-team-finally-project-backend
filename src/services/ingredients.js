import { ingredientModel } from '../models/ingredient.js';

export function fetchIngredientsService() {
  return ingredientModel.find({}, { name: 1 });
}
