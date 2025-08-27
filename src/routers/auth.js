import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import { registerUserSchema, loginSchema } from "../validation/auth.js";
import {
  loginController,
  logoutController,
  refreshUserSessionController,
  registerController,
} from "../controllers/auth.js";


const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutController));

export default router;
