import {isHttpError} from 'http-errors';

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (isHttpError(error) === true) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.name, data: error });
  }
   res.status(500).json({ status: 500, message: 'Internal server error' });
}