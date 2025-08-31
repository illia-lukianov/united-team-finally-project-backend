import createHttpError from "http-errors";

import { userModel } from "../models/user.js";
import { sessionModel } from "../models/session.js";

export async function auth(request, response, next) {
  const authorization = request.get('Authorization');

  if (typeof authorization !== "string") {
    throw new createHttpError.Unauthorized("Please provide your access token");
  }

  const [ bearer, accessToken ] = authorization.split(" ", 2);

  if (bearer !== "Bearer" || typeof authorization !== "string") {
    throw new createHttpError.Unauthorized("Please provide your access token");
  }

  const session = await sessionModel.findOne({ accessToken });

  if (session === null) {
    throw new createHttpError.Unauthorized("Session not found");
  }
  if (session.accessTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized("Access token is expired");
  }

  const user = await userModel.findById(session.userId);

  if (user === null) {
    throw new createHttpError.Unauthorized("User not found");
  }

  request.user = { id: user._id, name: user.name };
  next();
}
