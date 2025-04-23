import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError, isOperationalError } from '../utils/errors';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError (our custom errors)
  if (isOperationalError(error)) {
    const appError = error as AppError;
    res.status(appError.statusCode).json({
      status: 'error',
      code: appError.code,
      message: appError.message,
      details: appError.details,
    });
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          status: 'error',
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: 'A record with this value already exists',
        });
        return;
      case 'P2025':
        res.status(404).json({
          status: 'error',
          code: 'NOT_FOUND',
          message: 'Record not found',
        });
        return;
      default:
        res.status(500).json({
          status: 'error',
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
        });
        return;
    }
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};
