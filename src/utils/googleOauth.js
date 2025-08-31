import { OAuth2Client } from 'google-auth-library';
import getEnvVariables from './getEnvVariables.js';

// const googleOauth2Client = new OAuth2Client({
//   client_id: getEnvVariables('GOOGLE_CLIENT_ID'),
//   client_secret: getEnvVariables('GOOGLE_CLIENT_SECRET'),
//   redirectUri: getEnvVariables('GOOGLE_REDIRECT_URI'),
// });
const client = new OAuth2Client(getEnvVariables('GOOGLE_CLIENT_ID'));

export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: getEnvVariables('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    console.log('✅ GOOGLE PAYLOAD:', payload);
    return payload;
  } catch (error) {
    console.error('❌ GOOGLE AUTH ERROR:', error);
    throw new Error('Google token verification failed');
  }
};

// export async function getOAuthURL() {
//   return googleOauth2Client.generateAuthUrl({
//     scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
//   });
// }

// export async function validateCode(code) {
//   const response = await googleOauth2Client.getToken(code);
//   return googleOauth2Client.verifyIdToken({
//     idToken: response.tokens.id_token,
//   });
// }
