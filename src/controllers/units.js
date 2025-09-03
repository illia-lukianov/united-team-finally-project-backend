import { getUnits } from '../services/units.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createHttpError from 'http-errors';

export const getUnitsController = ctrlWrapper(async (req, res) => {  
  const units = await getUnits();

  if (!units) throw createHttpError(404, 'Units not found');

  res.json({
    status: 200,
    message: "Successfully found units!",
    data: units,
  });
});
