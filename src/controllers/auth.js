import { User } from "../models/user.js";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from "../services/auth.js";

export async function registerController(request, response) {
  const user = await registerUser(request.body);
  console.log("User created:", user);
  const session = await loginUser(request.body.email, request.body.password);
  console.log("Session created:", session);
  // response.cookie("sessionId", session._id, {
  //   httpOnly: true,
  //   expire: session.refreshTokenValidUntil,
  // });

  // response.cookie("refreshToken", session.refreshToken, {
  //   httpOnly: true,
  //   expire: session.refreshTokenValidUntil,
  // });

  response.json({
    id: user._id,
    email: user.email,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
}
export async function loginController(request, response) {
  const session = await loginUser(request.body.email, request.body.password);

  const user = await User.findById(session.userId);

  response.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.json({
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}
export async function refreshUserSessionController(request, response) {
  const { sessionId, refreshToken } = request.cookies;
  const session = await refreshUserSession(sessionId, refreshToken);

  response.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.json({
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
}
export async function logoutController(request, response) {
  const { sessionId } = request.cookies;
  if (typeof sessionId !== "undefined") {
    await logoutUser(sessionId);
  }

  response.clearCookie("sessionId");
  response.clearCookie("refreshToken");

  response.status(204).end();
}
