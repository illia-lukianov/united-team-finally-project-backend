import crypto from 'node:crypto';

import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getEnvVariables from '../utils/getEnvVariables.js';

import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';

export async function registerUser(payload) {
  const user = await userModel.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return userModel.create({ ...payload, password: hashedPassword });
}
export async function loginUser(email, password) {
  const user = await userModel.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const accessToken = jwt.sign({ userId: user._id, email: user.email }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '10m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '7d',
  });

  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
export async function refreshUserSession(sessionId, refreshToken) {
  const session = await sessionModel.findById(sessionId);

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token us invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  const user = await userModel.findById(session.userId);

  if (user === null) {
    throw new createHttpError.Unauthorized('User not found');
  }

  const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '10m',
  });
  const newRefreshToken = jwt.sign({ userId: user._id }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '7d',
  });

  await sessionModel.deleteOne({ _id: session._id });

  return sessionModel.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
export async function logoutUser(session_id) {
  await sessionModel.deleteOne({ _id: session_id });
}
