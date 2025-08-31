import { verifyGoogleToken } from '../utils/googleOauth.js';
import { userModel } from '../models/user.js';
import {
  loginOrRegister,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPwd,
} from '../services/auth.js';
import getEnvVariables from '../utils/getEnvVariables.js';
// import { getOAuthURL, validateCode } from '../utils/googleOauth.js';

export async function registerController(request, response) {
  const user = await registerUser(request.body);
  const session = await loginUser(request.body.email, request.body.password);

  response.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
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
  });

  response.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
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
  });

  response.cookie('refreshToken', session.refreshToken, {
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
  if (typeof sessionId !== 'undefined') {
    await logoutUser(sessionId);
  }

  response.clearCookie('sessionId');
  response.clearCookie('refreshToken');

  response.status(204).end();
}

export async function requestResetEmailController(request, response) {
  console.log(`Received reset request for email: ${request.body.email}`);
  await requestResetEmail(request.body.email);
  console.log('Password reset email sent successfully');
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

// export async function getOauthController(request, response) {
//   const url = await getOAuthURL();

//   response.json({
//     status: 200,
//     message: 'Successfully get oauth url',
//     data: {
//       oauth_url: url,
//     },
//   });
// }

// export async function confirmOauthController(request, response) {
//   console.log('Received OAuth code:', request.body.code);
//   const ticket = await validateCode(request.body.code);

//   const session = await loginOrRegister(ticket.payload.email, ticket.payload.name);

//   response.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expire: session.refreshTokenValidUntil,
//   });

//   response.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expire: session.refreshTokenValidUntil,
//   });

//   response.json({
//     status: 201,
//     message: 'Login via Google was successful',
//     data: {
//       // user: {
//       //   id: user._id,
//       //   email: user.email,
//       // },
//       accessToken: session.accessToken,
//     },
//   });
// }

export async function googleLoginController(req, res) {
  try {
    console.log('=== GOOGLE OAUTH DEBUG ===');
    console.log('GOOGLE_CLIENT_ID:', getEnvVariables('GOOGLE_CLIENT_ID'));
    console.log('GOOGLE_CLIENT_SECRET:', getEnvVariables('GOOGLE_CLIENT_SECRET'));
    console.log('REQUEST BODY:', req.body);

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Missing Google token' });
    }

    const payload = await verifyGoogleToken(token);
    const { email, name } = payload;

    const session = await loginOrRegister(email, name);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 201,
      message: 'Google login successful',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: error.message });
  }
}
