import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  confirmOauthSchema,
} from '../validation/auth.js';
import {
  googleLoginController,
  confirmEmailController,
  loginController,
  logoutController,
  refreshUserSessionController,
  registerController,
  requestResetEmailController,
  resetPwdController,
} from '../controllers/auth.js';
import { googleAuth } from '../services/auth.js';


const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);
router.post('/confirm-email', validateBody(confirmEmailSchema), ctrlWrapper(confirmEmailController))
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/request-password-reset', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
router.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPwdController));
router.get('/get-oauth-url', ctrlWrapper(getOauthController));
router.post('/confirm-oauth', validateBody(confirmOauthSchema), ctrlWrapper(confirmOauthController));
router.post('/google', ctrlWrapper(googleLoginController));
router.post('/google', googleAuth);

export default router;
