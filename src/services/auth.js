import * as fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'crypto'
import Handlebars from 'handlebars';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getEnvVariables from '../utils/getEnvVariables.js';
import { userModel } from '../models/user.js';
import { sessionModel } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';

const CONFIRM_EMAIL_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/confirm-email.hbs'),
  { encoding: 'utf-8' },
);

const RESET_PWD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'utf-8' },
);

export async function registerUser(payload) {
  const existingUser = await userModel.findOne({ email: payload.email });

  if (existingUser) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await userModel.create({ ...payload, password: hashedPassword, isConfirmed: false, expiresAt: new Date(Date.now() + 15 * 60 * 1000), });

  const token = jwt.sign(
    { email: payload.email },
    getEnvVariables('SECRET_JWT'),
    { expiresIn: '15m' }
  );

  const template = Handlebars.compile(CONFIRM_EMAIL_TEMPLATE)

  const mail = await sendMail({
    to: payload.email,
    subject: 'Confirmation email',
    html: template({
      confirmEmailLink: `https://united-team-finally-project-front-e.vercel.app/auth/confirm-email/${token}`,
    }),
  });

  if (!mail.accepted || mail.accepted.length === 0) {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  return newUser;
}

export async function confirmEmail(token) {
  try {
    const decoded = jwt.verify(token, getEnvVariables('SECRET_JWT'));

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    if (user.isConfirmed === "true") {
      throw new createHttpError.Conflict('Email is already confirmed');
    } else {
      user.isConfirmed = true;
      user.isConfirmed = true;
      user.expiresAt = null;
      await user.save();
    }

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, getEnvVariables('SECRET_JWT'), {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign({ userId: user._id }, getEnvVariables('SECRET_JWT'), {
      expiresIn: '7d',
    });

    await sessionModel.deleteOne({ userId: user._id });
    const session = await sessionModel.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return session

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

export async function loginUser(email, password) {
  const user = await userModel.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  if (!user.isConfirmed) {
      throw new createHttpError.Unauthorized('Account is not confirmed');
    }
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const accessToken = jwt.sign({ userId: user._id, email: user.email }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '7d',
  });

  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000),
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
    expiresIn: '30m',
  });
  const newRefreshToken = jwt.sign({ userId: user._id }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '7d',
  });

  await sessionModel.deleteOne({ _id: session._id });

  return sessionModel.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
export async function logoutUser(session_id) {
  await sessionModel.deleteOne({ _id: session_id });
}

export async function requestResetEmail(email) {

  const user = await userModel.findOne({ email });

  if (user === null) {
    throw new createHttpError.NotFound('User was not found');
  }

  const token = jwt.sign({ sub: user._id, name: user.name }, getEnvVariables('SECRET_JWT'), {
    expiresIn: '15m',
  });

  const template = Handlebars.compile(RESET_PWD_TEMPLATE);

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: template({
      resetPasswordLink: `https://united-team-finally-project-front-e.vercel.app/auth/reset-password/${token}`,
    }),
  });
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
    const password = await bcrypt.hash(randomBytes(30).toString('base64'), 10);
    user = await userModel.create({ email, name, password });
  }
  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
