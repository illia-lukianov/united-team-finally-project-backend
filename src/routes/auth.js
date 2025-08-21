import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, loginSchema } from "../validation/auth.js";
import {} from "../controllers/auth.js";
const router = express.Router();
router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerController)
);
router.post("/login", validateBody(loginSchema), ctrlWrapper(logInController));
router.post("refresh", ctrlWrapper(refreshController));
router.post("/logout", ctrlWrapper(logOutController));
export default router;
