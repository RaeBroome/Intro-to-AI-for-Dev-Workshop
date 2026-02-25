import { TaskStatus, TaskPriority } from '../types';

export const VALID_STATUSES: string[] = Object.values(TaskStatus);
export const VALID_PRIORITIES: string[] = Object.values(TaskPriority);

export const DEFAULT_STATUS = TaskStatus.TODO;
export const DEFAULT_PRIORITY = TaskPriority.MEDIUM;

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
