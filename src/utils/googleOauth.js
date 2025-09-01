import { OAuth2Client } from 'google-auth-library';
import getEnvVariables from './getEnvVariables.js';

const googleOauth2Client = new OAuth2Client({
  clientId: getEnvVariables('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVariables('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVariables('GOOGLE_REDIRECT_URI'), // має точно збігатися з Google Cloud Console
});

export async function getOAuthURL() {
  return googleOauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',       
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
  });
}

export async function validateCode(code) {
  const { tokens } = await googleOauth2Client.getToken(code);
  googleOauth2Client.setCredentials(tokens);

  return googleOauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: getEnvVariables('GOOGLE_CLIENT_ID'),
  });
}