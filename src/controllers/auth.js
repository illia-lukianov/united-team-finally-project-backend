import { userModel } from '../models/user.js';
import {
  confirmEmail,
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPwd,
} from '../services/auth.js';
import { getOAuthURL, validateCode } from '../utils/googleOauth.js';

export async function registerController(request, response) {
  const user = await registerUser(request.body);

  response.status(201).json({
    status: 201,
    message: 'Successfully registered. Please confirm your email before login.',
    data: {
      email: user.email,
    },
  });
}
export async function confirmEmailController(request, response) {
  const session = await confirmEmail(request.body.token, request.body.location);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });
  response.json({
    status: 200,
    message: 'Confirmed email successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function loginController(request, response) {
  const session = await loginUser(request.body.email, request.body.password, request.body.location);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.json({
    status: 201,
    message: 'User successfully registered and login',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshUserSessionController(request, response) {
  const { sessionId, refreshToken } = request.cookies;
  const session = await refreshUserSession(sessionId, refreshToken, request.body.location);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    sameSite: 'none',
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

export async function requestResetEmailController(request, response) {
  await requestResetEmail(request.body.email);

  response.json({
    status: 200,
    message: 'Message sent successfully',
  });
}

export async function resetPwdController(request, response) {
  const { token, password } = request.body;

  await resetPwd(token, password);

  response.json({
    status: 200,
    message: 'Reset password successfully',
  });
}

export async function getOauthController(request, response) {
  const url = await getOAuthURL();

  response.json({
    status: 200,
    message: 'Successfully get oauth url',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOauthController(request, response) {
  const ticket = await validateCode(request.body.code);

  const session = await loginOrRegister(ticket.payload.email, ticket.payload.name, request.body.location);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    sameSite: 'none',
    secure: true,
  });

  response.json({
    status: 201,
    message: 'Login via Google was successful',
    data: {
      accessToken: session.accessToken,
    },
  });
}
