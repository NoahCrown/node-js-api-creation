import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import { DatabaseError, NotFoundError } from '../../utils/errors';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

class TodoService {
  private prisma: PrismaClient;
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly MAX_PAGE_SIZE = 100;

  constructor() {
    this.prisma = prisma;
  }

  public async createTodo(title: string, description: string) {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title,
          description,
        },
      });
      return todo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new DatabaseError('Failed to create todo', error);
    }
  }

  public async getAllTodos(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Prisma.TodoGetPayload<{}>>> {
    try {
      const page = Math.max(params?.page ?? 1, 1);
      const limit = Math.min(
        Math.max(params?.limit ?? this.DEFAULT_PAGE_SIZE, 1),
        this.MAX_PAGE_SIZE
      );
      const skip = (page - 1) * limit;

      const [todos, total] = await Promise.all([
        this.prisma.todo.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.todo.count(),
      ]);

      return {
        data: todos,
        metadata: {
          total,
          currentPage: page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new DatabaseError('Failed to fetch todos', error);
    }
  }

  public async getTodoById(id: string) {
    try {
      const todo = await this.prisma.todo.findUnique({
        where: { id },
      });
      if (!todo) {
        throw new NotFoundError('Todo', id);
      }
      return todo;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error fetching todo:', error);
      throw new DatabaseError('Failed to fetch todo', error);
    }
  }

  public async updateTodo(
    id: string,
    title: string,
    description: string,
    completed: boolean
  ) {
    try {
      const todo = await this.prisma.todo.update({
        where: { id },
        data: {
          title,
          description,
          completed,
        },
      });
      return todo;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Todo', id);
      }
      console.error('Error updating todo:', error);
      throw new DatabaseError('Failed to update todo', error);
    }
  }

  public async deleteTodo(id: string) {
    try {
      if (!id) {
        throw new NotFoundError('Todo', id);
      }
      const todo = await this.prisma.todo.delete({
        where: { id },
      });
      return todo;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Todo', id);
      }
      console.error('Error deleting todo:', error);
      throw new DatabaseError('Failed to delete todo', error);
    }
  }

  public async deleteAllTodos() {
    try {
      const todos = await this.prisma.todo.deleteMany();
      return todos;
    } catch (error) {
      console.error('Error deleting all todos:', error);
      throw new DatabaseError('Failed to delete all todos', error);
    }
  }
}

export default new TodoService();
