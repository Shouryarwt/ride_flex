import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    // Extract field-specific error messages
    const validationErrors: Record<string, string> = {};
    for (const field in (err as any).errors) {
      validationErrors[field] = (err as any).errors[field].message;
    }
    message = Object.values(validationErrors).join('; ') || 'Validation Error';
    errors = validationErrors;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if ((err as any).type === 'entity.too.large') {
    statusCode = 413;
    message = 'Uploaded files are too large. Please use smaller images or PDF files.';
  } else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON request body';
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `${field} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  console.error('Error:', {
    name: err.name,
    message: err.message,
    statusCode,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
    errors,
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
