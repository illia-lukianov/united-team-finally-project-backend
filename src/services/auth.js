import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import User from "../models/user.js";

export async function registerUser(payload) {
  const { email, password, name } = payload;
  if (!email || !password || !name) {
    throw new createHttpError.BadRequest("Missing required fields");
  }
  const existingUser = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict("Email is already in use");
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);
}
export async function loginUser(payload) {}
export async function refreshUserSession(payload) {}
export async function logoutUser(session_id) {}
