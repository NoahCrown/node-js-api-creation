import { Request, Response } from 'express';
import TodoController from '../../modules/controllers/todo.controller';
import TodoService from '../../modules/services/todo.service';
import { ValidationError } from '../../utils/errors';

jest.mock('../../modules/services/todo.service');

describe('TodoController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      query: {},
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
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

    const mockPaginatedResponse = {
      data: mockTodos,
      metadata: {
        total: 10,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };

    it('should return all todos with default pagination parameters', async () => {
      (TodoService.getAllTodos as jest.Mock).mockResolvedValue(
        mockPaginatedResponse
      );

      await TodoController.getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPaginatedResponse,
      });
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      const mockTodo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
      };

      (TodoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

      req.params = { id: '1' };

      await TodoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockTodo,
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
