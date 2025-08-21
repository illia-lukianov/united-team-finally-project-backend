import Joi from 'joi';

export const recipeSchema = Joi.object({
  name: Joi.string().max(64).required().messages({
    'string.base': 'Recipe name must be a string!',
    'string.max': 'Recipe name is too long!',
    'any.required': 'Field must not be empty!',
  }),
  decr: Joi.string().max(200).required().messages({
    'string.base': 'Recipe description must be a string!',
    'string.max': 'Recipe description is too long!',
    'any.required': 'Field must not be empty!',
  }),
  cookiesTime: Joi.number().min(1).max(360).required().messages({
    'number.base': 'Cooking time must be a number in minutes!',
    'number.min': 'Cooking time is too short!',
    'number.max': 'Cooking time is too long!',
    'any.required': 'Field must not be empty!',
  }),
  cals: Joi.number().min(1).max(10000).messages({
    'number.base': 'Amount of calories must be a number!',
    'number.min': 'Amount of calories is too small!',
    'number.max': 'Amount of calories is too large!',
  }),
  category: Joi.string().required().messages({
    'string.base': 'Category name must be a string!',
    'any.required': 'Field must not be empty!',
  }),
  ingredient: Joi.string().required().messages({
    'string.base': 'Ingredient name must be a string!',
    'any.required': 'Field must not be empty!',
  }),
  imgredientAmount: Joi.number().min(2).max(16).required().messages({
    'number.base': 'Ingredient amount must be a number!',
    'number.min': 'Ingredient amount is too small!',
    'number.max': 'Ingredient amount is too large!',
    'any.required': 'Field must not be empty!',
  }),
  instruction: Joi.string().max(1200).required().messages({
    'string.base': 'Recipe instruction must be a string!',
    'string.max': 'Recipe instruction is too long!',
    'any.required': 'Field must not be empty!',
  }),
});
