<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { FetchError } from 'ofetch';
import { useI18n } from 'vue-i18n';
import { useAuth } from '~/composables/useAuth';
import { useTasks, type TaskStatus } from '~/composables/useTasks';
import { useToast } from '~/composables/useToast';
import { useConfirm } from '~/composables/useConfirm';

const router = useRouter();
const { t } = useI18n();
const { accessToken, fetchProfile } = useAuth();
const {
  tasks,
  taskLists,
  taskListTasks,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listTaskLists,
  createTaskList,
  deleteTaskList,
  listTaskListTasks,
  addTaskToTaskList,
  removeTaskFromTaskList
} = useTasks();
const { pushToast } = useToast();
const { confirm } = useConfirm();

const loading = ref(false);
const submitting = ref(false);
const listSubmitting = ref(false);
const assigningTaskId = ref('');
const errorMessage = ref('');
const activeFilter = ref<'all' | TaskStatus>('all');
const activeTaskListId = ref('all');
const targetTaskListId = ref('');

const form = reactive({
  title: '',
  description: '',
  status: 'pending' as TaskStatus,
  dueDate: ''
});

const taskListForm = reactive({
  title: '',
  description: ''
});

const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed'];

const resolveErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string | string[]; error?: string }>;
  const message = fetchError?.response?._data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return message || fetchError?.response?._data?.error || (t('tasks.feedback.unexpected') as string);
};

const toApiDate = (value: string) => (value ? new Date(value).toISOString() : null);

const formatDueDate = (value: string | null) => {
  if (!value) return t('tasks.card.noDueDate') as string;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const sourceTasks = computed(() => {
  if (activeTaskListId.value === 'all') return tasks.value;
  return taskListTasks.value[activeTaskListId.value] ?? [];
});

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') return sourceTasks.value;
  return sourceTasks.value.filter((task) => task.status === activeFilter.value);
});

const counters = computed(() => ({
  all: sourceTasks.value.length,
  pending: sourceTasks.value.filter((task) => task.status === 'pending').length,
  in_progress: sourceTasks.value.filter((task) => task.status === 'in_progress').length,
  completed: sourceTasks.value.filter((task) => task.status === 'completed').length
}));

const currentTaskList = computed(() => taskLists.value.find((taskList) => taskList.id === activeTaskListId.value) ?? null);
const selectedTargetList = computed(() => taskLists.value.find((taskList) => taskList.id === targetTaskListId.value) ?? null);

const ensureAuth = async () => {
  if (accessToken.value) return true;
  try {
    await fetchProfile();
    return true;
  } catch {
    await navigateTo('/login');
    return false;
  }
};

const loadTasks = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await Promise.all([listTasks(), listTaskLists()]);
    if (activeTaskListId.value !== 'all') {
      await listTaskListTasks(activeTaskListId.value);
    }
    if (!targetTaskListId.value && taskLists.value.length) {
      targetTaskListId.value = taskLists.value[0].id;
    }
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.status = 'pending';
  form.dueDate = '';
};

const handleCreate = async () => {
  errorMessage.value = '';
  if (!form.title.trim()) {
    errorMessage.value = t('tasks.feedback.titleRequired') as string;
    pushToast('error', errorMessage.value);
    return;
  }

  submitting.value = true;
  try {
    const task = await createTask({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      dueDate: toApiDate(form.dueDate)
    });
    if (targetTaskListId.value) {
      await addTaskToTaskList(targetTaskListId.value, task.id);
    }
    pushToast('success', t('tasks.feedback.created') as string);
    resetForm();
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    submitting.value = false;
  }
};

const handleCreateTaskList = async () => {
  errorMessage.value = '';
  if (!taskListForm.title.trim()) {
    errorMessage.value = t('tasks.feedback.taskListTitleRequired') as string;
    pushToast('error', errorMessage.value);
    return;
  }

  listSubmitting.value = true;
  try {
    const taskList = await createTaskList({
      title: taskListForm.title.trim(),
      description: taskListForm.description.trim() || null
    });
    targetTaskListId.value = taskList.id;
    activeTaskListId.value = taskList.id;
    await listTaskListTasks(taskList.id);
    taskListForm.title = '';
    taskListForm.description = '';
    pushToast('success', t('tasks.feedback.taskListCreated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    listSubmitting.value = false;
  }
};

const handleSelectTaskList = async (taskListId: string) => {
  activeTaskListId.value = taskListId;
  errorMessage.value = '';
  if (taskListId === 'all') return;
  try {
    await listTaskListTasks(taskListId);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleDeleteTaskList = async (taskListId: string) => {
  const approved = await confirm({
    title: t('tasks.taskLists.confirmDelete.title') as string,
    message: t('tasks.taskLists.confirmDelete.message') as string,
    confirmLabel: t('tasks.taskLists.confirmDelete.confirm') as string,
    cancelLabel: t('tasks.taskLists.confirmDelete.cancel') as string
  });
  if (!approved) return;

  try {
    await deleteTaskList(taskListId);
    if (activeTaskListId.value === taskListId) activeTaskListId.value = 'all';
    if (targetTaskListId.value === taskListId) targetTaskListId.value = taskLists.value[0]?.id ?? '';
    pushToast('success', t('tasks.feedback.taskListDeleted') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleAssignTask = async (taskId: string) => {
  if (!targetTaskListId.value) return;
  assigningTaskId.value = taskId;
  errorMessage.value = '';
  try {
    await addTaskToTaskList(targetTaskListId.value, taskId);
    pushToast('success', t('tasks.feedback.taskAssigned') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    assigningTaskId.value = '';
  }
};

const handleRemoveFromActiveList = async (taskId: string) => {
  if (activeTaskListId.value === 'all') return;
  try {
    await removeTaskFromTaskList(activeTaskListId.value, taskId);
    pushToast('success', t('tasks.feedback.taskRemovedFromList') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleQuickStatus = async (taskId: string, status: TaskStatus) => {
  errorMessage.value = '';
  try {
    await updateTask(taskId, { status });
    pushToast('success', t('tasks.feedback.updated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleDelete = async (taskId: string) => {
  errorMessage.value = '';
  const approved = await confirm({
    title: t('tasks.confirmDelete.title') as string,
    message: t('tasks.confirmDelete.message') as string,
    confirmLabel: t('tasks.confirmDelete.confirm') as string,
    cancelLabel: t('tasks.confirmDelete.cancel') as string
  });
  if (!approved) return;

  try {
    await deleteTask(taskId);
    pushToast('success', t('tasks.feedback.deleted') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

onMounted(async () => {
  const ok = await ensureAuth();
  if (ok) {
    await loadTasks();
  }
});
</script>

<template>
  <section class="tasks-page">
    <header class="hero">
      <div>
        <p class="eyebrow">{{ t('tasks.eyebrow') }}</p>
        <h1>{{ t('tasks.heading') }}</h1>
        <p class="hero-copy">{{ t('tasks.description') }}</p>
      </div>
      <button type="button" class="ghost" @click="router.push('/dashboard')">
        {{ t('tasks.backToDashboard') }}
      </button>
    </header>

    <div class="summary-grid">
      <article class="summary-card steel">
        <span>{{ t('tasks.filters.all') }}</span>
        <strong>{{ counters.all }}</strong>
      </article>
      <article class="summary-card amber">
        <span>{{ t('tasks.filters.pending') }}</span>
        <strong>{{ counters.pending }}</strong>
      </article>
      <article class="summary-card blue">
        <span>{{ t('tasks.filters.inProgress') }}</span>
        <strong>{{ counters.in_progress }}</strong>
      </article>
      <article class="summary-card green">
        <span>{{ t('tasks.filters.completed') }}</span>
        <strong>{{ counters.completed }}</strong>
      </article>
    </div>

    <div class="content-grid">
      <section class="panel form-panel">
        <div class="panel-head">
          <h2>{{ t('tasks.create.heading') }}</h2>
          <p>{{ t('tasks.create.subheading') }}</p>
        </div>

        <form class="task-form" @submit.prevent="handleCreate">
          <label>
            {{ t('tasks.form.title') }}
            <input v-model="form.title" type="text" maxlength="200" :placeholder="t('tasks.form.titlePlaceholder') as string" />
          </label>

          <label>
            {{ t('tasks.form.description') }}
            <textarea v-model="form.description" rows="4" :placeholder="t('tasks.form.descriptionPlaceholder') as string" />
          </label>

          <div class="split-fields">
            <label>
              {{ t('tasks.form.status') }}
              <select v-model="form.status">
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ t(`tasks.status.${status}`) }}
                </option>
              </select>
            </label>

            <label>
              {{ t('tasks.form.dueDate') }}
              <input v-model="form.dueDate" type="datetime-local" />
            </label>
          </div>

          <label v-if="taskLists.length">
            {{ t('tasks.taskLists.addNewTo') }}
            <select v-model="targetTaskListId">
              <option value="">{{ t('tasks.taskLists.withoutList') }}</option>
              <option v-for="taskList in taskLists" :key="taskList.id" :value="taskList.id">
                {{ taskList.title }}
              </option>
            </select>
          </label>

          <button type="submit" class="primary" :disabled="submitting">
            {{ submitting ? t('tasks.create.submitting') : t('tasks.create.submit') }}
          </button>
        </form>

        <div class="divider" />

        <div class="panel-head compact-head">
          <h2>{{ t('tasks.taskLists.heading') }}</h2>
          <p>{{ t('tasks.taskLists.subheading') }}</p>
        </div>

        <form class="task-form" @submit.prevent="handleCreateTaskList">
          <label>
            {{ t('tasks.taskLists.title') }}
            <input v-model="taskListForm.title" type="text" maxlength="160" :placeholder="t('tasks.taskLists.titlePlaceholder') as string" />
          </label>
          <label>
            {{ t('tasks.taskLists.description') }}
            <textarea v-model="taskListForm.description" rows="3" :placeholder="t('tasks.taskLists.descriptionPlaceholder') as string" />
          </label>
          <button type="submit" class="primary" :disabled="listSubmitting">
            {{ listSubmitting ? t('tasks.taskLists.creating') : t('tasks.taskLists.create') }}
          </button>
        </form>

        <div class="task-list-switcher">
          <button type="button" class="list-switch" :class="{ active: activeTaskListId === 'all' }" @click="handleSelectTaskList('all')">
            <span>{{ t('tasks.taskLists.allTasks') }}</span>
            <strong>{{ tasks.length }}</strong>
          </button>
          <div v-for="taskList in taskLists" :key="taskList.id" class="list-row">
            <button type="button" class="list-switch" :class="{ active: activeTaskListId === taskList.id }" @click="handleSelectTaskList(taskList.id)">
              <span>{{ taskList.title }}</span>
              <strong>{{ taskListTasks[taskList.id]?.length ?? 0 }}</strong>
            </button>
            <button type="button" class="danger icon-button" :aria-label="t('tasks.taskLists.delete') as string" @click="handleDeleteTaskList(taskList.id)">×</button>
          </div>
        </div>
      </section>

      <section class="panel list-panel">
        <div class="panel-head list-head">
          <div>
            <h2>{{ currentTaskList?.title || t('tasks.list.heading') }}</h2>
            <p>{{ currentTaskList?.description || t('tasks.list.subheading') }}</p>
          </div>
          <div class="filters">
            <button
              v-for="filter in ['all', 'pending', 'in_progress', 'completed']"
              :key="filter"
              type="button"
              class="filter-chip"
              :class="{ active: activeFilter === filter }"
              @click="activeFilter = filter as 'all' | TaskStatus"
            >
              {{ t(`tasks.filters.${filter === 'in_progress' ? 'inProgress' : filter}`) }}
            </button>
          </div>
        </div>

        <p v-if="loading" class="muted">{{ t('tasks.list.loading') }}</p>
        <p v-else-if="!filteredTasks.length" class="muted">{{ t('tasks.list.empty') }}</p>

        <div v-else class="task-list">
          <article v-for="task in filteredTasks" :key="task.id" class="task-card">
            <div class="task-main">
              <div class="task-topline">
                <NuxtLink :to="`/tasks/${task.id}`" class="task-title">{{ task.title }}</NuxtLink>
                <span class="status-pill" :class="task.status">{{ t(`tasks.status.${task.status}`) }}</span>
              </div>
              <p class="task-description">{{ task.description || t('tasks.card.noDescription') }}</p>
              <p class="task-meta">{{ formatDueDate(task.dueDate) }}</p>
            </div>
            <div class="task-actions">
              <button type="button" class="ghost small" @click="handleQuickStatus(task.id, 'pending')">{{ t('tasks.actions.markPending') }}</button>
              <button type="button" class="ghost small" @click="handleQuickStatus(task.id, 'in_progress')">{{ t('tasks.actions.markInProgress') }}</button>
              <button type="button" class="ghost small" @click="handleQuickStatus(task.id, 'completed')">{{ t('tasks.actions.markCompleted') }}</button>
              <button v-if="activeTaskListId === 'all' && selectedTargetList" type="button" class="ghost small" :disabled="assigningTaskId === task.id" @click="handleAssignTask(task.id)">
                {{ assigningTaskId === task.id ? t('tasks.actions.assigning') : t('tasks.actions.assignToList', { list: selectedTargetList.title }) }}
              </button>
              <button v-if="activeTaskListId !== 'all'" type="button" class="ghost small" @click="handleRemoveFromActiveList(task.id)">{{ t('tasks.actions.removeFromList') }}</button>
              <NuxtLink :to="`/tasks/${task.id}`" class="ghost small link-button">{{ t('tasks.actions.open') }}</NuxtLink>
              <button type="button" class="danger small" @click="handleDelete(task.id)">{{ t('tasks.actions.delete') }}</button>
            </div>
          </article>
        </div>
      </section>
    </div>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.tasks-page {
  width: min(1180px, 100%);
  display: grid;
  gap: 1.5rem;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.75rem;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #f7efe5, #eef6ff 60%, #f4fbf1);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: #5b6474;
}

.hero h1,
.panel h2 {
  margin: 0;
}

.hero-copy,
.panel-head p,
.muted,
.task-meta,
.task-description {
  color: #5b6474;
}

.summary-grid,
.content-grid {
  display: grid;
  gap: 1rem;
}

.summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.summary-card,
.panel,
.task-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.summary-card {
  padding: 1.2rem 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.summary-card strong {
  font-size: 2rem;
}

.summary-card.steel {
  background: linear-gradient(180deg, #ffffff, #f3f6fb);
}

.summary-card.amber {
  background: linear-gradient(180deg, #fff8eb, #fff0c7);
}

.summary-card.blue {
  background: linear-gradient(180deg, #edf6ff, #dbeafe);
}

.summary-card.green {
  background: linear-gradient(180deg, #ecfdf3, #d1fae5);
}

.content-grid {
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
  align-items: start;
}

.panel {
  padding: 1.4rem;
}

.panel-head {
  margin-bottom: 1rem;
}

.compact-head {
  margin-top: 0;
}

.task-form,
.task-list,
.task-actions,
.task-list-switcher {
  display: grid;
  gap: 0.9rem;
}

label {
  display: grid;
  gap: 0.35rem;
  color: #334155;
  font-size: 0.95rem;
}

input,
textarea,
select,
button {
  font: inherit;
}

input,
textarea,
select {
  border: 1px solid #d6deea;
  border-radius: 0.9rem;
  padding: 0.8rem 0.95rem;
  background: #fff;
}

textarea {
  resize: vertical;
}

.split-fields,
.list-head,
.task-topline,
.list-row {
  display: flex;
  gap: 0.8rem;
}

.split-fields > label {
  flex: 1;
}

.list-head {
  justify-content: space-between;
  align-items: flex-start;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip,
.ghost,
.primary,
.danger,
.link-button,
.list-switch {
  border: none;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  cursor: pointer;
  text-decoration: none;
}

.filter-chip,
.ghost,
.link-button,
.list-switch {
  background: #edf2f7;
  color: #243041;
}

.filter-chip.active,
.list-switch.active {
  background: #1f2937;
  color: #fff;
}

.primary {
  background: #ba3a2d;
  color: #fff;
  font-weight: 600;
}

.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.divider {
  height: 1px;
  margin: 1.3rem 0;
  background: #e2e8f0;
}

.task-list-switcher {
  margin-top: 1rem;
}

.list-switch {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  text-align: left;
}

.list-row {
  align-items: center;
}

.icon-button {
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  flex: 0 0 auto;
}

.task-card {
  padding: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
}

.task-title {
  font-weight: 700;
  color: #111827;
}

.status-pill {
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  font-size: 0.78rem;
  text-transform: capitalize;
}

.status-pill.pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-pill.in_progress {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-pill.completed {
  background: #ecfdf5;
  color: #047857;
}

.task-description {
  margin: 0.4rem 0;
}

.task-meta {
  margin: 0;
  font-size: 0.9rem;
}

.task-actions {
  grid-auto-rows: min-content;
}

.small {
  padding: 0.55rem 0.8rem;
  font-size: 0.88rem;
}

.status {
  margin: 0;
  padding: 0.95rem 1.1rem;
  border-radius: 1rem;
}

.success {
  background: #ecfdf5;
  color: #047857;
}

.error {
  background: #fef2f2;
  color: #b91c1c;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero,
  .list-head,
  .task-card,
  .task-topline,
  .split-fields {
    display: grid;
  }
}
</style>
