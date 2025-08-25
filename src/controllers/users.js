import { isValidObjectId } from 'mongoose';
import { getUserInfo } from '../services/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';

export const getUserInfoController = ctrlWrapper(async (req, res) => {
  const { sessionId } = req.cookies;

  if (!isValidObjectId(sessionId)) throw createHttpError(400, 'Wrong session ID');

  const userInfo = await getUserInfo(sessionId);

  if (!userInfo) throw createHttpError(404, 'User not found');

  res.json({
    status: 200,
    message: "Successfully found user's info!",
    data: userInfo,
  });
});
