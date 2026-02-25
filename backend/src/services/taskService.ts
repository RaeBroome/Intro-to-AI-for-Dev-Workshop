import { Task, TaskStatus, TaskPriority } from '../types';
import { ITaskRepository } from '../repositories/taskRepository';
import {
  VALID_STATUSES,
  VALID_PRIORITIES,
  DEFAULT_STATUS,
  DEFAULT_PRIORITY,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from '../constants/task';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class TaskService {
  constructor(private repository: ITaskRepository) {}

  getAllTasks(filters?: { status?: string; priority?: string }): Task[] {
    let tasks = this.repository.findAll();

    if (filters?.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters?.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const parsedId = this.parseId(id);
    const task = this.repository.findById(parsedId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  createTask(data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
  }): Task {
    const { title, description, status, priority } = data;

    this.validateTaskData(title, description);

    if (status) {
      this.validateStatus(status);
    }

    if (priority) {
      this.validatePriority(priority);
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: 0, // repository assigns the real id
      title: title!.trim(),
      description: description ? description.trim() : '',
      status: (status as TaskStatus) || DEFAULT_STATUS,
      priority: (priority as TaskPriority) || DEFAULT_PRIORITY,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(newTask);
  }

  updateTask(
    id: string,
    data: { title?: string; description?: string; status?: string; priority?: string }
  ): Task {
    const parsedId = this.parseId(id);
    const existing = this.repository.findById(parsedId);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    const { title, description, status, priority } = data;

    if (title !== undefined) {
      this.validateTaskData(title, description || '');
    }

    if (status !== undefined) {
      this.validateStatus(status);
    }

    if (priority !== undefined) {
      this.validatePriority(priority);
    }

    const updates: Partial<Task> = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status as TaskStatus;
    if (priority !== undefined) updates.priority = priority as TaskPriority;

    return this.repository.update(parsedId, updates)!;
  }

  patchTask(
    id: string,
    data: { title?: string; description?: string; status?: string; priority?: string }
  ): Task {
    const parsedId = this.parseId(id);
    const existing = this.repository.findById(parsedId);
    if (!existing) {
      throw new NotFoundError('Task not found');
    }

    const { title, description, status, priority } = data;

    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }
    }

    if (status !== undefined) {
      this.validateStatus(status);
    }

    if (priority !== undefined) {
      this.validatePriority(priority);
    }

    const updates: Partial<Task> = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status as TaskStatus;
    if (priority !== undefined) updates.priority = priority as TaskPriority;

    return this.repository.update(parsedId, updates)!;
  }

  deleteTask(id: string): Task {
    const parsedId = this.parseId(id);
    const deleted = this.repository.delete(parsedId);
    if (!deleted) {
      throw new NotFoundError('Task not found');
    }
    return deleted;
  }

  deleteAllTasks(): number {
    return this.repository.deleteAll();
  }

  private parseId(id: string): number {
    const parsed = parseInt(id);
    if (isNaN(parsed)) {
      throw new ValidationError('Invalid task ID');
    }
    return parsed;
  }

  private validateTaskData(title: string | undefined, description: string | undefined): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (title.length > TITLE_MAX_LENGTH) {
      throw new ValidationError(`Title must be less than ${TITLE_MAX_LENGTH} characters`);
    }
    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      throw new ValidationError(
        `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`
      );
    }
  }

  private validateStatus(status: string): void {
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError(
        `Invalid status. Must be: ${VALID_STATUSES.join(', ').replace(/, ([^,]*)$/, ', or $1')}`
      );
    }
  }

  private validatePriority(priority: string): void {
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new ValidationError(
        `Invalid priority. Must be: ${VALID_PRIORITIES.join(', ').replace(/, ([^,]*)$/, ', or $1')}`
      );
    }
  }
}
