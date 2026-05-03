import { useApiFetch } from '~/services/api-client';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type TaskPayload = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
};

export const useTasks = () => {
  const apiFetch = useApiFetch();
  const tasks = useState<Task[]>('tasks_items', () => []);
  const currentTask = useState<Task | null>('tasks_current', () => null);

  const listTasks = async () => {
    const data = await apiFetch<Task[]>('/v1/tasks');
    tasks.value = data;
    return data;
  };

  const getTask = async (id: string) => {
    const data = await apiFetch<Task>(`/v1/tasks/${id}`);
    currentTask.value = data;
    return data;
  };

  const createTask = async (payload: TaskPayload) => {
    const data = await apiFetch<Task>('/v1/tasks', {
      method: 'POST',
      body: payload
    });
    tasks.value = [data, ...tasks.value];
    return data;
  };

  const updateTask = async (id: string, payload: Partial<TaskPayload>) => {
    const data = await apiFetch<Task>(`/v1/tasks/${id}`, {
      method: 'PUT',
      body: payload
    });
    tasks.value = tasks.value.map((task) => (task.id === id ? data : task));
    if (currentTask.value?.id === id) {
      currentTask.value = data;
    }
    return data;
  };

  const deleteTask = async (id: string) => {
    await apiFetch(`/v1/tasks/${id}`, {
      method: 'DELETE'
    });
    tasks.value = tasks.value.filter((task) => task.id !== id);
    if (currentTask.value?.id === id) {
      currentTask.value = null;
    }
  };

  return {
    tasks,
    currentTask,
    listTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
  };
};
