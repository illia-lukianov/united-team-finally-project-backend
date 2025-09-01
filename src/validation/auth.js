import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();

export const confirmEmailSchema = Joi.object({
  token: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();

export const refreshSchema = Joi.object({
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
}).required();

export const confirmOauthSchema = Joi.object({
  code: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();
