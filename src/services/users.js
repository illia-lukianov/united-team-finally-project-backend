import { sessionModel } from '../models/session.js';
import { userModel } from '../models/user.js'; //Це потрібно, поки модель юзера не використовується

export const getUserInfo = async (sessionId) => {
  const currentUser = await sessionModel
    .findById(sessionId, { userId: 1 })
    .populate({ path: 'userId', select: '-password' })
    .lean();
  return currentUser.userId;
};
