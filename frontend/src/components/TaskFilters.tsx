import { Filter } from 'lucide-react';
import { TaskFilters as TaskFiltersType } from '../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  taskCount: number;
}

export default function TaskFilters({ filters, onChange, taskCount }: TaskFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filters.status || ''}
            onChange={e =>
              onChange({ ...filters, status: e.target.value as TaskFiltersType['status'] })
            }
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={e =>
              onChange({ ...filters, priority: e.target.value as TaskFiltersType['priority'] })
            }
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
