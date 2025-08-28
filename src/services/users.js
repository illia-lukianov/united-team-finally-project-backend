import { userModel } from '../models/user.js';

export const getUserInfo = async (userId) => {
  return await userModel.findById(userId, {password: 0});;
};
