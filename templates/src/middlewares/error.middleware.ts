import { apiError } from '../utils/apiError';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof apiError) {
    return res.status(err.statusCode).json(err.toJSON(req));
  }

  // fallback for unhandled errors
  console.error('Unexpected Error:', err);
  const fallbackError = new apiError(500, 'Internal Server Error', {
    isOperational: false,
  });
  return res.status(500).json(fallbackError.toJSON(req));
};
