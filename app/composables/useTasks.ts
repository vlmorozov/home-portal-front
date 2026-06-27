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

export type TaskEvent = {
  id: string;
  taskId: string;
  userId: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Subtask = {
  id: string;
  userId: string;
  parentTaskId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskList = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskListTask = {
  id: string;
  taskListId: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type RawTask = Omit<Task, 'status' | 'dueDate'> & Partial<Pick<Task, 'status' | 'dueDate'>>;

type TaskPayload = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
};

type TaskListPayload = {
  title: string;
  description?: string | null;
};

const DEFAULT_STATUS: TaskStatus = 'pending';

export const useTasks = () => {
  const apiFetch = useApiFetch();
  const tasks = useState<Task[]>('tasks_items', () => []);
  const currentTask = useState<Task | null>('tasks_current', () => null);
  const taskEvents = useState<TaskEvent[]>('tasks_events_current', () => []);
  const subtasks = useState<Subtask[]>('tasks_subtasks_current', () => []);
  const taskLists = useState<TaskList[]>('tasks_lists', () => []);
  const taskListTasks = useState<Record<string, Task[]>>('tasks_list_items', () => ({}));

  const normalizeTask = (task: RawTask, event?: TaskEvent | null): Task => ({
    ...task,
    status: event?.status ?? task.status ?? DEFAULT_STATUS,
    dueDate: event ? event.dueDate : task.dueDate ?? null
  });

  const getLatestTaskEvent = async (taskId: string) => {
    try {
      return await apiFetch<TaskEvent | null>(`/v1/tasks/${taskId}/events/latest`);
    } catch {
      return null;
    }
  };

  const enrichTask = async (task: RawTask) => normalizeTask(task, await getLatestTaskEvent(task.id));

  const replaceTaskEverywhere = (taskId: string, nextTask: Task) => {
    tasks.value = tasks.value.map((task) => (task.id === taskId ? nextTask : task));
    taskListTasks.value = Object.fromEntries(
      Object.entries(taskListTasks.value).map(([taskListId, items]) => [
        taskListId,
        items.map((task) => (task.id === taskId ? nextTask : task))
      ])
    );
    if (currentTask.value?.id === taskId) currentTask.value = nextTask;
  };

  const listTasks = async () => {
    const data = await apiFetch<RawTask[]>('/v1/tasks');
    const enriched = await Promise.all(data.map((task) => enrichTask(task)));
    tasks.value = enriched;
    return enriched;
  };

  const getTask = async (id: string) => {
    const data = await apiFetch<RawTask>(`/v1/tasks/${id}`);
    const enriched = await enrichTask(data);
    currentTask.value = enriched;
    return enriched;
  };

  const createTaskEvent = async (taskId: string, payload: { status: TaskStatus; dueDate?: string | null }) => {
    const data = await apiFetch<TaskEvent>(`/v1/tasks/${taskId}/events`, {
      method: 'POST',
      body: payload
    });
    if (currentTask.value?.id === taskId) {
      taskEvents.value = [data, ...taskEvents.value];
      replaceTaskEverywhere(taskId, normalizeTask(currentTask.value, data));
    } else {
      const existing = tasks.value.find((task) => task.id === taskId);
      if (existing) replaceTaskEverywhere(taskId, normalizeTask(existing, data));
    }
    return data;
  };

  const updateTaskEvent = async (
    taskId: string,
    taskEventId: string,
    payload: Partial<{ status: TaskStatus; dueDate: string | null }>
  ) => {
    const data = await apiFetch<TaskEvent>(`/v1/tasks/${taskId}/events/${taskEventId}`, {
      method: 'PUT',
      body: payload
    });
    taskEvents.value = taskEvents.value.map((event) => (event.id === taskEventId ? data : event));
    const existing = currentTask.value?.id === taskId ? currentTask.value : tasks.value.find((task) => task.id === taskId);
    if (existing) replaceTaskEverywhere(taskId, normalizeTask(existing, data));
    return data;
  };

  const deleteTaskEvent = async (taskId: string, taskEventId: string) => {
    await apiFetch(`/v1/tasks/${taskId}/events/${taskEventId}`, { method: 'DELETE' });
    taskEvents.value = taskEvents.value.filter((event) => event.id !== taskEventId);
    const latest = taskEvents.value[0] ?? (await getLatestTaskEvent(taskId));
    const existing = currentTask.value?.id === taskId ? currentTask.value : tasks.value.find((task) => task.id === taskId);
    if (existing) replaceTaskEverywhere(taskId, normalizeTask(existing, latest));
  };

  const listTaskEvents = async (taskId: string) => {
    const data = await apiFetch<TaskEvent[]>(`/v1/tasks/${taskId}/events`);
    taskEvents.value = [...data].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return taskEvents.value;
  };

  const createTask = async (payload: TaskPayload) => {
    const data = await apiFetch<RawTask>('/v1/tasks', {
      method: 'POST',
      body: {
        title: payload.title,
        description: payload.description ?? null
      }
    });
    const normalized = normalizeTask(data);
    tasks.value = [normalized, ...tasks.value];
    if (payload.status || payload.dueDate !== undefined) {
      const event = await createTaskEvent(normalized.id, {
        status: payload.status ?? DEFAULT_STATUS,
        dueDate: payload.dueDate ?? null
      });
      return normalizeTask(normalized, event);
    }
    return normalized;
  };

  const updateTask = async (id: string, payload: Partial<TaskPayload>) => {
    let data = tasks.value.find((task) => task.id === id) ?? currentTask.value ?? null;
    if ('title' in payload || 'description' in payload) {
      const updated = await apiFetch<RawTask>(`/v1/tasks/${id}`, {
        method: 'PUT',
        body: {
          title: payload.title,
          description: payload.description
        }
      });
      data = normalizeTask(updated, data ? {
        id: '',
        taskId: id,
        userId: data.userId,
        status: data.status,
        dueDate: data.dueDate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } : null);
    }

    let result = normalizeTask((data ?? { id, userId: '', title: '', description: null, createdAt: '', updatedAt: '' }) as RawTask);
    if ('status' in payload || 'dueDate' in payload) {
      const event = await createTaskEvent(id, {
        status: payload.status ?? result.status,
        dueDate: payload.dueDate !== undefined ? payload.dueDate : result.dueDate
      });
      result = normalizeTask(result, event);
    } else {
      result = await enrichTask(result);
    }

    replaceTaskEverywhere(id, result);
    return result;
  };

  const deleteTask = async (id: string) => {
    await apiFetch(`/v1/tasks/${id}`, { method: 'DELETE' });
    tasks.value = tasks.value.filter((task) => task.id !== id);
    Object.keys(taskListTasks.value).forEach((listId) => {
      taskListTasks.value[listId] = taskListTasks.value[listId].filter((task) => task.id !== id);
    });
    if (currentTask.value?.id === id) currentTask.value = null;
  };

  const listTaskLists = async () => {
    const data = await apiFetch<TaskList[]>('/v1/task-lists');
    taskLists.value = data;
    return data;
  };

  const createTaskList = async (payload: TaskListPayload) => {
    const data = await apiFetch<TaskList>('/v1/task-lists', { method: 'POST', body: payload });
    taskLists.value = [data, ...taskLists.value];
    return data;
  };

  const updateTaskList = async (id: string, payload: Partial<TaskListPayload>) => {
    const data = await apiFetch<TaskList>(`/v1/task-lists/${id}`, { method: 'PUT', body: payload });
    taskLists.value = taskLists.value.map((taskList) => (taskList.id === id ? data : taskList));
    return data;
  };

  const deleteTaskList = async (id: string) => {
    await apiFetch(`/v1/task-lists/${id}`, { method: 'DELETE' });
    taskLists.value = taskLists.value.filter((taskList) => taskList.id !== id);
    const { [id]: _removed, ...rest } = taskListTasks.value;
    taskListTasks.value = rest;
  };

  const listTaskListTasks = async (taskListId: string) => {
    const data = await apiFetch<RawTask[]>(`/v1/task-lists/${taskListId}/tasks`);
    const enriched = await Promise.all(data.map((task) => enrichTask(task)));
    taskListTasks.value = { ...taskListTasks.value, [taskListId]: enriched };
    return enriched;
  };

  const addTaskToTaskList = async (taskListId: string, taskId: string) => {
    const data = await apiFetch<TaskListTask>(`/v1/task-lists/${taskListId}/tasks`, {
      method: 'POST',
      body: { taskId }
    });
    await listTaskListTasks(taskListId);
    return data;
  };

  const removeTaskFromTaskList = async (taskListId: string, taskId: string) => {
    await apiFetch(`/v1/task-lists/${taskListId}/tasks/${taskId}`, { method: 'DELETE' });
    taskListTasks.value = {
      ...taskListTasks.value,
      [taskListId]: (taskListTasks.value[taskListId] ?? []).filter((task) => task.id !== taskId)
    };
  };

  const listSubtasks = async (taskId: string) => {
    const data = await apiFetch<Subtask[]>(`/v1/tasks/${taskId}/subtasks`);
    subtasks.value = data;
    return data;
  };

  const createSubtask = async (taskId: string, childTaskId: string) => {
    const data = await apiFetch<Subtask>(`/v1/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: { taskId: childTaskId }
    });
    subtasks.value = [data, ...subtasks.value];
    return data;
  };

  const updateSubtask = async (taskId: string, subtaskId: string, childTaskId: string) => {
    const data = await apiFetch<Subtask>(`/v1/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      body: { taskId: childTaskId }
    });
    subtasks.value = subtasks.value.map((subtask) => (subtask.id === subtaskId ? data : subtask));
    return data;
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    await apiFetch(`/v1/tasks/${taskId}/subtasks/${subtaskId}`, { method: 'DELETE' });
    subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
  };

  return {
    tasks,
    currentTask,
    taskEvents,
    subtasks,
    taskLists,
    taskListTasks,
    listTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    listTaskEvents,
    createTaskEvent,
    updateTaskEvent,
    deleteTaskEvent,
    listSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    listTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    listTaskListTasks,
    addTaskToTaskList,
    removeTaskFromTaskList
  };
};
