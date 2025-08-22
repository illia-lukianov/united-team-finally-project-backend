import { sessionModel } from '../models/session.js';
import { usersCollection } from '../models/usersModel.js';

export const getUserInfo = async (sessionId) => {
  console.log('in service');

  const userId = await sessionModel.find({ sessionId });
  console.log('userId', userId);

  const user = await usersCollection.find({ _id: userId });
  console.log('user', user);
  return;
};
