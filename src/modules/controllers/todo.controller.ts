import { Request, Response } from 'express';
import TodoService from '../services/todo.service';
import { DatabaseError, ValidationError } from '../../utils/errors';

class TodoController {
  private todoService: typeof TodoService;

  constructor() {
    this.todoService = TodoService;
    // Bind all methods to ensure proper 'this' context
    this.getAllTodos = this.getAllTodos.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  async getAllTodos(req: Request, res: Response): Promise<void> {
    const todos = await this.todoService.getAllTodos();
    res.status(200).json({
      status: 'success',
      data: todos,
    });
  }

  async createTodo(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body;
    const newTodo = await this.todoService.createTodo(title, description);
    res.status(201).json({
      status: 'success',
      data: newTodo,
    });
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    const { title, description, completed } = req.body;
    const todoId = req.params.id;

    const updatedTodo = await this.todoService.updateTodo(
      todoId,
      title,
      description,
      completed
    );

    res.status(200).json({
      status: 'success',
      data: updatedTodo,
    });
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    const todoId = req.params.id;
    try {
      if (!todoId) {
        throw new ValidationError('Todo ID is required');
      }

      await this.todoService.deleteTodo(todoId);
      res.status(204).json({
        status: 'success',
        message: 'Todo deleted successfully',
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          status: 'error',
          message: error.message,
        });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({
          status: 'error',
          message: error.message,
        });
      }
      throw error;
    }
  }
}

export default new TodoController();
