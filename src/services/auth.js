import crypto from 'node:crypto';

import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getEnvVariables from '../utils/getEnvVariables.js';

import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';

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

export async function requestResetEmail(email) {
  console.log(`Received reset request for email: ${email}`);

  const user = await userModel.findOne({ email });

  if (user === null) {
    console.log(`User not found for email: ${email}`);

    throw new createHttpError.NotFound('User was not found');
  }

  console.log(`User found: ${user._id}, sending reset email`);

  const token = jwt.sign({ sub: user._id, name: user.name }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '10m',
  });

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: `<p>To reset password please click the <a href="http://localhost:8080/reset-password/${token}">Link</a></p>`,
  });

  console.log(`Password reset email sent to: ${email}`);
}

export async function resetPwd(token, password) {
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, getEnvVariables('SECRET_JWT'));

    console.log('Token verified, finding user...');

    const user = await userModel.findById(decoded.sub);

    if (user === null) {
      console.log('User not found');
      throw new createHttpError.NotFound('User was not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Updating password...');

    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }
    throw error;
  }
}

export async function loginOrRegister(email, name) {
  let user = await userModel.findOne({ email });
  if (user === null) {
    const password = await bcrypt.hash(crypto.randomBytes(30).toString('base64'), 10);
    user = await userModel.create({ email, name, password });
  }
  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
