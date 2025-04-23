import { ZodError, z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest =
  <T extends z.ZodType>(
    schema: T,
    field: 'body' | 'query' | 'params' | 'headers'
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Directly validate the field data
      const validatedData = await schema.parseAsync(req[field]);
      // Update the request field with validated data
      req[field] = validatedData;
      return next();
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({
          message: 'Validation error',
          errors,
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
