import crypto from "node:crypto";

import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Session, { sessionModel } from "../models/session.js";
import { refreshUserSessionController } from "../controllers/auth.js";

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict("Email is already in use");
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);

  // const { accessToken, refreshToken } = generateTokens(newUser);
  // return { id: newUser._id email: newUser.email, accessToken, refreshToken};
}
export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized("Email or password is incorrect");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized("Email or password is incorrect");
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
export async function refreshUserSession(sessionId, refreshToken) {}
export async function logoutUser(session_id) {
  await sessionModel.deleteOne({ _id: session_id });
}

// function generateTokens(user) {
//   const accessToken = jwt.sign(
//     { id: user._id },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "15m" }
//   );
//   const refreshToken = jwt.sign(
//     { id: user._id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: "7d" }
//   );

//   return { accessToken, refreshToken };
// }
