import Joi from 'joi';

export const recipeSchema = Joi.object({
  title: Joi.string().max(64).required().messages({
    'string.base': 'Recipe name must be a string!',
    'string.max': 'Recipe name is too long!',
    'any.required': 'Recipe name field must not be empty!',
  }),
  description: Joi.string().max(200).required().messages({
    'string.base': 'Recipe description must be a string!',
    'string.max': 'Recipe description is too long!',
    'any.required': 'Description field must not be empty!',
  }),
  thumb: Joi.string().max(200).messages({
    'string.base': 'Recipe thumb must be a string!',
    'string.max': 'Recipe thumb is too long!',
  }),
  time: Joi.number().min(1).max(360).required().messages({
    'string.base': 'Cooking time must be a string in minutes!',
    'string.min': 'Cooking time is too short!',
    'string.max': 'Cooking time is too long!',
    'any.required': 'Cooking time field must not be empty!',
  }),
  cals: Joi.number().min(1).max(10000).messages({
    'string.base': 'Amount of calories must be a string!',
    'string.min': 'Amount of calories is too small!',
    'string.max': 'Amount of calories is too large!',
  }),
  category: Joi.string().required().messages({
    'string.base': 'Category name must be a string!',
    'any.required': 'Category name field must not be empty!',
  }),
  area: Joi.string().required().messages({
    'string.base': 'Area name must be a string!',
    'any.required': 'Area name field must not be empty!',
  }),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().required().messages({
        'string.base': 'Ingredient ID must be a string!',
        'any.required': 'Ingredient ID is required!',
      }),
      measure: Joi.string().required().messages({
        'string.base': 'Ingredient measure must be a string!',
        'any.required': 'Ingredient measure is required!',
      }),
  })),
  instructions: Joi.string().max(1200).required().messages({
    'string.base': 'Recipe instructions must be a string!',
    'string.max': 'Recipe instructions is too long!',
    'any.required': 'Instructions field must not be empty!',
  }),
}).required();
