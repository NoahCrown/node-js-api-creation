import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
}) satisfies z.ZodType<{
  title: string;
  description?: string;
}>;

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
}) satisfies z.ZodType<{
  title?: string;
  description?: string;
  completed?: boolean;
}>;

export const deleteTodoSchema = z.object({
  id: z.string().min(1, 'ID is required'),
}) satisfies z.ZodType<{
  id: string;
}>;
