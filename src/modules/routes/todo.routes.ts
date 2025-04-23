import { RequestHandler, Router } from 'express';
import TodoController from '../controllers/todo.controller';
import { validateRequest } from '../../middlewares/request-validation';
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
} from '../../schema/todo.schema';

const router = Router();

router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.post(
  '/',
  validateRequest(createTodoSchema, 'body') as RequestHandler,
  TodoController.createTodo
);
router.put(
  '/:id',
  validateRequest(updateTodoSchema, 'body') as RequestHandler,
  TodoController.updateTodo
);
router.delete(
  '/:id',
  validateRequest(deleteTodoSchema, 'params') as RequestHandler,
  TodoController.deleteTodo
);

export default router;
