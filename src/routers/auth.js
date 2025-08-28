import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema, loginSchema, requestResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import {
  getOauthController,
  loginController,
  logoutController,
  refreshUserSessionController,
  registerController,
  requestResetEmailController,
  resetPwdController,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/request-password-reset', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
router.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPwdController));
router.get('/get-oauth-url', ctrlWrapper(getOauthController));

export default router;
