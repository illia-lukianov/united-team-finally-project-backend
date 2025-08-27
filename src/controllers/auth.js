import { userModel } from '../models/user.js';
import { loginUser, logoutUser, refreshUserSession, registerUser } from '../services/auth.js';

export async function registerController(request, response) {
  const user = await registerUser(request.body);
  const session = await loginUser(request.body.email, request.body.password);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
  });

  response.json({
    status: 201,
    message: 'Successfully registered',
    data: {
      // user: {
      //   id: user._id,
      //   email: user.email,
      // },
      accessToken: session.accessToken,
    },
  });
}
export async function loginController(request, response) {
  const session = await loginUser(request.body.email, request.body.password);

  const user = await userModel.findById(session.userId);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
  });

  response.json({
    status: 201,
    message: 'User successfully registered and login',
    data: {
      accessToken: session.accessToken,
    //   refreshToken: session.refreshToken,
    // },
    // user: {
    //   id: user._id,
    //   email: user.email,
    //   name: user.name,
    }, 
  });
}
export async function refreshUserSessionController(request, response) {
  const { sessionId, refreshToken } = request.cookies;
  const session = await refreshUserSession(sessionId, refreshToken);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: "None",
    secure: true,
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
  if (typeof sessionId !== 'undefined') {
    await logoutUser(sessionId);
  }

  response.clearCookie('sessionId');
  response.clearCookie('refreshToken');

  response.status(204).end();
}
