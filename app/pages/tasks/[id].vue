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
const { currentTask, getTask, updateTask, deleteTask } = useTasks();
const { pushToast } = useToast();
const { confirm } = useConfirm();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const errorMessage = ref('');
const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed'];

const form = reactive({
  title: '',
  description: '',
  status: 'pending' as TaskStatus,
  dueDate: ''
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

const fillForm = () => {
  if (!currentTask.value) return;
  form.title = currentTask.value.title;
  form.description = currentTask.value.description || '';
  form.status = currentTask.value.status;
  form.dueDate = toInputDate(currentTask.value.dueDate);
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
    await getTask(taskId.value);
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
    pushToast('success', t('tasks.feedback.updated') as string);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
    pushToast('error', errorMessage.value);
  } finally {
    saving.value = false;
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
    <div v-else-if="currentTask" class="panel detail-panel">
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
    </div>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.task-detail {
  width: min(860px, 100%);
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

.panel {
  background: #fff;
  border-radius: 1.3rem;
  padding: 1.5rem;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.07);
}

.detail-form,
label,
.actions,
.meta-grid {
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
.actions {
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

.meta-grid article {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1rem;
}

.meta-grid span {
  display: block;
  color: #64748b;
  margin-bottom: 0.35rem;
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

@media (max-width: 720px) {
  .detail-header,
  .grid-row,
  .actions {
    display: grid;
  }
}
</style>
