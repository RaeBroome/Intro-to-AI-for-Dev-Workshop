import { useState } from 'react';
import {
  Trash2,
  Edit3,
  Check,
  X,
  ArrowUpCircle,
  ArrowRightCircle,
  CheckCircle2,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (
    id: number,
    data: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: typeof Check }> = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: ArrowRightCircle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: ArrowUpCircle },
  done: { label: 'Done', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
};

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    await onUpdate(id, { title: editTitle.trim(), description: editDescription.trim() });
    cancelEdit();
  };

  const cycleStatus = (task: Task) => {
    const order: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdate(task.id, { status: next });
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
        <p className="text-lg">No tasks yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const statusCfg = STATUS_CONFIG[task.status];
        const priorityCfg = PRIORITY_CONFIG[task.priority];
        const StatusIcon = statusCfg.icon;
        const isEditing = editingId === task.id;

        return (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => cycleStatus(task)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color} cursor-pointer hover:opacity-80`}
                      title="Click to cycle status"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </button>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityCfg.color}`}
                    >
                      {priorityCfg.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
