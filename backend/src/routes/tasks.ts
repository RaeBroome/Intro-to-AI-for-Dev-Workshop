import { Router, Request, Response } from 'express';
import { TaskService, ValidationError, NotFoundError } from '../services/taskService';
import { InMemoryTaskRepository } from '../repositories/taskRepository';

const router = Router();
const repository = new InMemoryTaskRepository();
const taskService = new TaskService(repository);

/**
 * Maps service-layer errors to HTTP responses.
 */
function handleError(err: unknown, res: Response): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}

/** GET /api/tasks - Get all tasks */
router.get('/', (req: Request, res: Response) => {
  const status = req.query.status as string;
  const priority = req.query.priority as string;
  const tasks = taskService.getAllTasks({ status, priority });
  res.json(tasks);
});

/** GET /api/tasks/:id - Get single task */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    handleError(err, res);
  }
});

/** POST /api/tasks - Create new task */
router.post('/', (req: Request, res: Response) => {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    handleError(err, res);
  }
});

/** PUT /api/tasks/:id - Update task */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const task = taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    handleError(err, res);
  }
});

/** PATCH /api/tasks/:id - Partial update */
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const task = taskService.patchTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    handleError(err, res);
  }
});

/** DELETE /api/tasks/:id - Delete task */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deletedTask = taskService.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (err) {
    handleError(err, res);
  }
});

/** DELETE /api/tasks - Delete all tasks */
router.delete('/', (req: Request, res: Response) => {
  const count = taskService.deleteAllTasks();
  res.json({ message: `Deleted ${count} tasks` });
});

export default router;
