import { useState, useEffect, useCallback } from 'react';
import { ClipboardList } from 'lucide-react';
import { Task, CreateTaskData, TaskFilters as TaskFiltersType } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks(filters);
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (data: CreateTaskData) => {
    await createTask(data);
    await loadTasks();
  };

  const handleUpdate = async (id: number, data: Partial<CreateTaskData>) => {
    await updateTask(id, data);
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    await loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ClipboardList className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Agentic Workshop Starter</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <TaskForm onSubmit={handleCreate} />
        <TaskFilters filters={filters} onChange={setFilters} taskCount={tasks.length} />

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : (
          <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default App;
