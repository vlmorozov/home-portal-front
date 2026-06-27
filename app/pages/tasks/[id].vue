<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { FetchError } from 'ofetch';
import { useI18n } from 'vue-i18n';
import { useAuth } from '~/composables/useAuth';
import { useTasks, type TaskStatus } from '~/composables/useTasks';
import { useToast } from '~/composables/useToast';
import { useConfirm } from '~/composables/useConfirm';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { accessToken, fetchProfile } = useAuth();
const {
  tasks,
  currentTask,
  taskEvents,
  subtasks,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  listTaskEvents,
  createTaskEvent,
  deleteTaskEvent,
  listSubtasks,
  createSubtask,
  deleteSubtask
} = useTasks();
const { pushToast } = useToast();
const { confirm } = useConfirm();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const eventSubmitting = ref(false);
const subtaskSubmitting = ref(false);
const errorMessage = ref('');
const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed'];

const form = reactive({
  title: '',
  description: '',
  status: 'pending' as TaskStatus,
  dueDate: ''
});

const eventForm = reactive({
  status: 'pending' as TaskStatus,
  dueDate: ''
});

const subtaskForm = reactive({
  taskId: ''
});

const taskId = computed(() => String(route.params.id || ''));

const resolveErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string | string[]; error?: string }>;
  const message = fetchError?.response?._data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return message || fetchError?.response?._data?.error || (t('tasks.feedback.unexpected') as string);
};

const toInputDate = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const normalized = new Date(date.getTime() - offset * 60000);
  return normalized.toISOString().slice(0, 16);
};

const toApiDate = (value: string) => (value ? new Date(value).toISOString() : null);

const formatDate = (value: string | null) => {
  if (!value) return t('tasks.card.noDueDate') as string;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const taskTitleById = (id: string) => tasks.value.find((task) => task.id === id)?.title ?? id;

const availableSubtaskOptions = computed(() => {
  const usedIds = new Set(subtasks.value.map((subtask) => subtask.taskId));
  return tasks.value.filter((task) => task.id !== taskId.value && !usedIds.has(task.id));
});

const fillForm = () => {
  if (!currentTask.value) return;
  form.title = currentTask.value.title;
  form.description = currentTask.value.description || '';
  form.status = currentTask.value.status;
  form.dueDate = toInputDate(currentTask.value.dueDate);
  eventForm.status = currentTask.value.status;
  eventForm.dueDate = toInputDate(currentTask.value.dueDate);
};

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

const loadTask = async () => {
  if (!taskId.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await Promise.all([getTask(taskId.value), listTaskEvents(taskId.value), listSubtasks(taskId.value), listTasks()]);
    fillForm();
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  if (!taskId.value) return;
  errorMessage.value = '';
  if (!form.title.trim()) {
    errorMessage.value = t('tasks.feedback.titleRequired') as string;
    pushToast('error', errorMessage.value);
    return;
  }

  saving.value = true;
  try {
    await updateTask(taskId.value, {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      dueDate: toApiDate(form.dueDate)
    });
    await listTaskEvents(taskId.value);
    fillForm();
    pushToast('success', t('tasks.feedback.updated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    saving.value = false;
  }
};

const handleCreateEvent = async () => {
  if (!taskId.value) return;
  eventSubmitting.value = true;
  errorMessage.value = '';
  try {
    await createTaskEvent(taskId.value, {
      status: eventForm.status,
      dueDate: toApiDate(eventForm.dueDate)
    });
    await listTaskEvents(taskId.value);
    await getTask(taskId.value);
    fillForm();
    pushToast('success', t('tasks.feedback.eventCreated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    eventSubmitting.value = false;
  }
};

const handleDeleteEvent = async (taskEventId: string) => {
  if (!taskId.value) return;
  try {
    await deleteTaskEvent(taskId.value, taskEventId);
    await listTaskEvents(taskId.value);
    await getTask(taskId.value);
    fillForm();
    pushToast('success', t('tasks.feedback.eventDeleted') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleCreateSubtask = async () => {
  if (!taskId.value || !subtaskForm.taskId) return;
  subtaskSubmitting.value = true;
  errorMessage.value = '';
  try {
    await createSubtask(taskId.value, subtaskForm.taskId);
    subtaskForm.taskId = '';
    pushToast('success', t('tasks.feedback.subtaskCreated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    subtaskSubmitting.value = false;
  }
};

const handleDeleteSubtask = async (subtaskId: string) => {
  if (!taskId.value) return;
  try {
    await deleteSubtask(taskId.value, subtaskId);
    pushToast('success', t('tasks.feedback.subtaskDeleted') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  }
};

const handleDelete = async () => {
  if (!taskId.value) return;
  const approved = await confirm({
    title: t('tasks.confirmDelete.title') as string,
    message: t('tasks.confirmDelete.message') as string,
    confirmLabel: t('tasks.confirmDelete.confirm') as string,
    cancelLabel: t('tasks.confirmDelete.cancel') as string
  });
  if (!approved) return;

  deleting.value = true;
  errorMessage.value = '';
  try {
    await deleteTask(taskId.value);
    pushToast('success', t('tasks.feedback.deleted') as string);
    await router.push('/tasks');
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  const ok = await ensureAuth();
  if (ok) {
    await loadTask();
  }
});
</script>

<template>
  <section class="task-detail">
    <header class="detail-header">
      <div>
        <p class="eyebrow">{{ t('tasks.detail.eyebrow') }}</p>
        <h1>{{ t('tasks.detail.heading') }}</h1>
      </div>
      <NuxtLink to="/tasks" class="ghost-link">{{ t('tasks.detail.back') }}</NuxtLink>
    </header>

    <div v-if="loading" class="panel muted">{{ t('tasks.detail.loading') }}</div>
    <div v-else-if="currentTask" class="detail-grid">
      <section class="panel detail-panel">
        <form class="detail-form" @submit.prevent="handleSave">
          <label>
            {{ t('tasks.form.title') }}
            <input v-model="form.title" type="text" maxlength="200" :placeholder="t('tasks.form.titlePlaceholder') as string" />
          </label>

          <label>
            {{ t('tasks.form.description') }}
            <textarea v-model="form.description" rows="5" :placeholder="t('tasks.form.descriptionPlaceholder') as string" />
          </label>

          <div class="grid-row">
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

          <div class="meta-grid">
            <article>
              <span>{{ t('tasks.detail.taskId') }}</span>
              <strong>{{ currentTask.id }}</strong>
            </article>
            <article>
              <span>{{ t('tasks.detail.createdAt') }}</span>
              <strong>{{ new Date(currentTask.createdAt).toLocaleString() }}</strong>
            </article>
            <article>
              <span>{{ t('tasks.detail.updatedAt') }}</span>
              <strong>{{ new Date(currentTask.updatedAt).toLocaleString() }}</strong>
            </article>
          </div>

          <div class="actions">
            <button type="submit" class="primary" :disabled="saving">
              {{ saving ? t('tasks.detail.saving') : t('tasks.detail.save') }}
            </button>
            <button type="button" class="danger" :disabled="deleting" @click="handleDelete">
              {{ deleting ? t('tasks.detail.deleting') : t('tasks.detail.delete') }}
            </button>
          </div>
        </form>
      </section>

      <section class="panel side-panel">
        <div class="panel-head">
          <h2>{{ t('tasks.events.heading') }}</h2>
          <p>{{ t('tasks.events.subheading') }}</p>
        </div>

        <form class="detail-form" @submit.prevent="handleCreateEvent">
          <div class="grid-row">
            <label>
              {{ t('tasks.form.status') }}
              <select v-model="eventForm.status">
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ t(`tasks.status.${status}`) }}
                </option>
              </select>
            </label>
            <label>
              {{ t('tasks.form.dueDate') }}
              <input v-model="eventForm.dueDate" type="datetime-local" />
            </label>
          </div>
          <button type="submit" class="primary" :disabled="eventSubmitting">
            {{ eventSubmitting ? t('tasks.events.creating') : t('tasks.events.create') }}
          </button>
        </form>

        <div class="event-list">
          <article v-for="event in taskEvents" :key="event.id" class="row-item">
            <div>
              <strong>{{ t(`tasks.status.${event.status}`) }}</strong>
              <p>{{ formatDate(event.dueDate) }}</p>
              <span>{{ new Date(event.createdAt).toLocaleString() }}</span>
            </div>
            <button type="button" class="danger small" @click="handleDeleteEvent(event.id)">{{ t('tasks.events.delete') }}</button>
          </article>
          <p v-if="!taskEvents.length" class="muted">{{ t('tasks.events.empty') }}</p>
        </div>
      </section>

      <section class="panel side-panel">
        <div class="panel-head">
          <h2>{{ t('tasks.subtasks.heading') }}</h2>
          <p>{{ t('tasks.subtasks.subheading') }}</p>
        </div>

        <form class="detail-form" @submit.prevent="handleCreateSubtask">
          <label>
            {{ t('tasks.subtasks.selectTask') }}
            <select v-model="subtaskForm.taskId">
              <option value="">{{ t('tasks.subtasks.selectPlaceholder') }}</option>
              <option v-for="task in availableSubtaskOptions" :key="task.id" :value="task.id">
                {{ task.title }}
              </option>
            </select>
          </label>
          <button type="submit" class="primary" :disabled="subtaskSubmitting || !subtaskForm.taskId">
            {{ subtaskSubmitting ? t('tasks.subtasks.adding') : t('tasks.subtasks.add') }}
          </button>
        </form>

        <div class="event-list">
          <article v-for="subtask in subtasks" :key="subtask.id" class="row-item">
            <div>
              <strong>{{ taskTitleById(subtask.taskId) }}</strong>
              <p>{{ subtask.taskId }}</p>
            </div>
            <div class="row-actions">
              <NuxtLink :to="`/tasks/${subtask.taskId}`" class="ghost-link small">{{ t('tasks.actions.open') }}</NuxtLink>
              <button type="button" class="danger small" @click="handleDeleteSubtask(subtask.id)">{{ t('tasks.subtasks.delete') }}</button>
            </div>
          </article>
          <p v-if="!subtasks.length" class="muted">{{ t('tasks.subtasks.empty') }}</p>
        </div>
      </section>
    </div>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.task-detail {
  width: min(1180px, 100%);
  display: grid;
  gap: 1.25rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.eyebrow {
  margin: 0 0 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: #64748b;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 1rem;
  align-items: start;
}

.detail-panel {
  grid-row: span 2;
}

.panel {
  background: #fff;
  border-radius: 1.3rem;
  padding: 1.5rem;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.07);
}

.panel-head {
  margin-bottom: 1rem;
}

.panel-head h2 {
  margin: 0;
}

.panel-head p,
.row-item p,
.row-item span {
  color: #64748b;
}

.detail-form,
label,
.actions,
.meta-grid,
.event-list {
  display: grid;
  gap: 1rem;
}

label {
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
  width: 100%;
  border: 1px solid #d6deea;
  border-radius: 0.95rem;
  padding: 0.8rem 0.95rem;
  background: #fff;
}

textarea {
  resize: vertical;
}

.grid-row,
.actions,
.row-item,
.row-actions {
  display: flex;
  gap: 1rem;
}

.grid-row > label,
.actions > * {
  flex: 1;
}

.meta-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.meta-grid article,
.row-item {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1rem;
}

.meta-grid span {
  display: block;
  color: #64748b;
  margin-bottom: 0.35rem;
}

.row-item {
  justify-content: space-between;
  align-items: flex-start;
}

.row-item p {
  margin: 0.25rem 0;
  word-break: break-word;
}

.row-item span {
  font-size: 0.86rem;
}

.row-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.primary,
.danger,
.ghost-link {
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.primary {
  background: #ba3a2d;
  color: #fff;
}

.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.ghost-link {
  background: #edf2f7;
  color: #243041;
}

.small {
  padding: 0.55rem 0.8rem;
  font-size: 0.88rem;
}

.status {
  margin: 0;
  border-radius: 1rem;
  padding: 0.9rem 1rem;
}

.success {
  background: #ecfdf5;
  color: #047857;
}

.error {
  background: #fef2f2;
  color: #b91c1c;
}

.muted {
  color: #64748b;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 980px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    grid-row: auto;
  }
}

@media (max-width: 720px) {
  .detail-header,
  .grid-row,
  .actions,
  .row-item {
    display: grid;
  }

  .row-actions {
    justify-content: stretch;
  }
}
</style>
