import Joi from 'joi';

export const recipeSchema = Joi.object({
  title: Joi.string().max(64).required().messages({
    'string.base': 'Recipe name must be a string!',
    'string.max': 'Recipe name is too long!',
    'any.required': 'Field must not be empty!',
  }),
  description: Joi.string().max(200).required().messages({
    'string.base': 'Recipe description must be a string!',
    'string.max': 'Recipe description is too long!',
    'any.required': 'Field must not be empty!',
  }),
  time: Joi.string().min(1).max(360).required().messages({
    'string.base': 'Cooking time must be a string in minutes!',
    'string.min': 'Cooking time is too short!',
    'string.max': 'Cooking time is too long!',
    'any.required': 'Field must not be empty!',
  }),
  cals: Joi.string().min(1).max(10000).messages({
    'string.base': 'Amount of calories must be a string!',
    'string.min': 'Amount of calories is too small!',
    'string.max': 'Amount of calories is too large!',
  }),
  category: Joi.string().required().messages({
    'string.base': 'Category name must be a string!',
    'any.required': 'Field must not be empty!',
  }),
  area: Joi.string().required().messages({
    'string.base': 'Area name must be a string!',
    'any.required': 'Field must not be empty!',
  }),
  ingredients: Joi.array().required().messages({
    'array.base': 'Ingredient list must be an array!',
    'any.required': 'Array must not be empty!',
  }),
  instruction: Joi.string().max(1200).required().messages({
    'string.base': 'Recipe instruction must be a string!',
    'string.max': 'Recipe instruction is too long!',
    'any.required': 'Field must not be empty!',
  }),
});
