import { isValidObjectId } from 'mongoose';
import { getUserInfo } from '../services/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';

export const getUserInfoController = ctrlWrapper(async (req, res) => {  

  const { id } = req.user;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Wrong user ID');

  const userInfo = await getUserInfo(id);

  if (!userInfo) throw createHttpError(404, 'User not found');

  res.json({
    status: 200,
    message: "Successfully found user's info!",
    data: userInfo,
  });
});
