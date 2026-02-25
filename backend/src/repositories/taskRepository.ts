import { Task } from '../types';

export interface ITaskRepository {
  findAll(): Task[];
  findById(id: number): Task | undefined;
  create(task: Task): Task;
  update(id: number, updates: Partial<Task>): Task | undefined;
  delete(id: number): Task | undefined;
  deleteAll(): number;
}

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return [...this.tasks];
  }

  findById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  create(task: Task): Task {
    const newTask: Task = { ...task, id: this.nextId++ };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updates: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  delete(id: number): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    const deleted = this.tasks[index];
    this.tasks.splice(index, 1);
    return deleted;
  }

  deleteAll(): number {
    const count = this.tasks.length;
    this.tasks = [];
    this.nextId = 1;
    return count;
  }
}
