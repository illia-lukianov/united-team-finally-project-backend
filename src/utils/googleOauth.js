import { OAuth2Client } from 'google-auth-library';
import getEnvVariables from './getEnvVariables.js';
const googleOauth2Client = new OAuth2Client({
  client_id: getEnvVariables('GOOGLE_CLIENT_ID'),
  client_secret: getEnvVariables('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVariables('GOOGLE_REDIRECT_URI'),
});

export async function getOAuthURL() {
  return googleOauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
  });
}

export async function validateCode(code) {
  const response = await googleOauth2Client.getToken(code);
  return googleOauth2Client.verifyIdToken({
    idToken: response.tokens.id_token,
  });
}
