import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  email: Joi.string().email().max(128).required(),
  password: Joi.string().min(8).max(128).required(),
}).required();

export const confirmEmailSchema = Joi.object({
  token: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().max(128).required(),
  password: Joi.string().min(8).max(128).required(),
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
  email: Joi.string().email().max(128).required(),
}).required();

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(128).required(),
  token: Joi.string().required(),
}).required();

export const confirmOauthSchema = Joi.object({
  code: Joi.string().required(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
}).required();
