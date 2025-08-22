import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from "../services/auth";

export async function registerController(request, response) {
  const user = await registerUser(request.body);

  response.json({
    id: user._id,
    email: user.email,
  });
}
export async function loginController(request, response) {
  const session = await loginUser(request.body.email, request.body.password);

  response.cookies("sessionId", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.cookies("refreshToken", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.json({
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    email: session.email,
    password: session.password,
  });
}
export async function refreshUserSessionController(request, response) {
  const { sessionId, refreshToken } = request.cookies;
  await refreshUserSession();
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
