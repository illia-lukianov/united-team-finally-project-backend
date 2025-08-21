import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import User from "../models/user.js";

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict("Email is already in use");
  }

  return User.create(payload);
}
export async function loginUser(payload) {}
export async function refreshUserSession(payload) {}
export async function logoutUser(session_id) {}
