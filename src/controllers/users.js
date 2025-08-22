import { getUserInfo } from '../services/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const getUserInfoController = ctrlWrapper(async (req, res) => {
  console.log('in controller');
  const { sessionId } = req.cookies;
  const result = await getUserInfo(sessionId);

  res.json(result);
});
