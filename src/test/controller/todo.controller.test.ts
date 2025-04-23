import { Request, Response } from 'express';
import TodoController from '../../modules/controllers/todo.controller';
import TodoService from '../../modules/services/todo.service';
import { ValidationError } from '../../utils/errors';

jest.mock('../../modules/services/todo.service');

describe('TodoController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Todo 1',
          description: 'Description 1',
          completed: false,
        },
        {
          id: '2',
          title: 'Todo 2',
          description: 'Description 2',
          completed: true,
        },
      ];

      (TodoService.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);

      await TodoController.getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTodos,
      });
    });
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const mockTodo = {
        title: 'Todo 1',
        description: 'Description 1',
      };

      (TodoService.createTodo as jest.Mock).mockResolvedValue(mockTodo);

      req.body = mockTodo;

      await TodoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTodo,
      });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const mockTodo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
      };

      (TodoService.updateTodo as jest.Mock).mockResolvedValue(mockTodo);

      req.params = { id: '1' };
      req.body = mockTodo;

      await TodoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTodo,
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const mockTodo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
      };

      (TodoService.deleteTodo as jest.Mock).mockResolvedValue(mockTodo);

      req.params = { id: '1' };

      await TodoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Todo deleted successfully',
      });
    });
  });
});
