<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FetchError } from 'ofetch';
import { useAuth } from '~/composables/useAuth';
import { useTasks } from '~/composables/useTasks';

const router = useRouter();
const { t } = useI18n();
const { profile, fetchProfile, logout } = useAuth();
const { tasks, listTasks } = useTasks();
const loadingProfile = ref(false);
const loadingTasks = ref(false);
const profileError = ref('');
const tasksError = ref('');

const pendingTasksCount = computed(() => tasks.value.filter((task) => task.status === 'pending').length);
const inProgressTasksCount = computed(() => tasks.value.filter((task) => task.status === 'in_progress').length);
const completedTasksCount = computed(() => tasks.value.filter((task) => task.status === 'completed').length);
const recentTasks = computed(() => [...tasks.value].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 4));

const stats = computed(() => [
  { titleKey: 'dashboard.stats.pendingTasks', value: pendingTasksCount.value, accent: '#c2410c' },
  { titleKey: 'dashboard.stats.inProgressTasks', value: inProgressTasksCount.value, accent: '#2563eb' },
  { titleKey: 'dashboard.stats.completedTasks', value: completedTasksCount.value, accent: '#059669' }
]);

const quickLinks = [
  { labelKey: 'dashboard.actions.tasks.label', descriptionKey: 'dashboard.actions.tasks.description', to: '/tasks' },
  { labelKey: 'dashboard.actions.register.label', descriptionKey: 'dashboard.actions.register.description', to: '/register' },
  { labelKey: 'dashboard.actions.signout.label', descriptionKey: 'dashboard.actions.signout.description', action: 'signout' }
];

const resolveErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string | string[]; error?: string }>;
  const message = fetchError?.response?._data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return message || fetchError?.response?._data?.error || '';
};

const loadProfile = async () => {
  profileError.value = '';
  loadingProfile.value = true;
  try {
    await fetchProfile();
  } catch (error) {
    profileError.value = resolveErrorMessage(error);
  } finally {
    loadingProfile.value = false;
  }
};

const loadTasks = async () => {
  tasksError.value = '';
  loadingTasks.value = true;
  try {
    await listTasks();
  } catch (error) {
    tasksError.value = resolveErrorMessage(error);
  } finally {
    loadingTasks.value = false;
  }
};

const handleSignOut = async () => {
  await logout();
  router.push('/login');
};

onMounted(async () => {
  await loadProfile();
  if (profile.value) {
    await loadTasks();
  }
});
</script>

<template>
  <section class="dashboard">
    <header>
      <div>
        <p class="eyebrow">{{ t('dashboard.eyebrow') }}</p>
        <h1>{{ t('dashboard.heading') }}</h1>
      </div>
      <button type="button" class="ghost" @click="handleSignOut">
        {{ t('dashboard.signOut') }}
      </button>
    </header>

    <div class="panel profile-panel">
      <template v-if="loadingProfile">
        <p class="muted">{{ t('dashboard.profile.loading') }}</p>
      </template>
      <template v-else-if="profile">
        <p class="eyebrow small">{{ t('dashboard.profile.title') }}</p>
        <h2 class="profile-name">{{ profile.username }}</h2>
        <p class="muted">{{ profile.email }}</p>
      </template>
      <template v-else>
        <p class="muted">{{ t('dashboard.profile.empty') }}</p>
      </template>
      <p v-if="profileError" class="status error">{{ profileError }}</p>
    </div>

    <div class="stats">
      <article v-for="stat in stats" :key="stat.titleKey" class="stat-card">
        <p class="stat-label">{{ t(stat.titleKey) }}</p>
        <p class="stat-value" :style="{ color: stat.accent }">{{ stat.value }}</p>
      </article>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>{{ t('dashboard.recentTasks') }}</h2>
        <NuxtLink to="/tasks" class="panel-link">{{ t('dashboard.openTasks') }}</NuxtLink>
      </div>
      <p v-if="loadingTasks" class="muted">{{ t('dashboard.tasks.loading') }}</p>
      <p v-else-if="tasksError" class="status error">{{ tasksError }}</p>
      <ul v-else-if="recentTasks.length">
        <li v-for="task in recentTasks" :key="task.id">
          <div>
            <strong>{{ task.title }}</strong>
            <p class="muted compact">{{ task.description || t('dashboard.tasks.noDescription') }}</p>
          </div>
          <span>{{ t(`dashboard.tasks.status.${task.status}`) }}</span>
        </li>
      </ul>
      <p v-else class="muted">{{ t('dashboard.tasks.empty') }}</p>
    </div>

    <div class="panel">
      <h2>{{ t('dashboard.quickActions') }}</h2>
      <div class="actions">
        <template v-for="link in quickLinks" :key="link.labelKey">
          <NuxtLink
            v-if="link.to"
            :to="link.to"
            class="action-card"
          >
            <p class="action-label">{{ t(link.labelKey) }}</p>
            <p class="action-description">{{ t(link.descriptionKey) }}</p>
          </NuxtLink>
          <button
            v-else
            type="button"
            class="action-card action-button"
            @click="handleSignOut"
          >
            <p class="action-label">{{ t(link.labelKey) }}</p>
            <p class="action-description">{{ t(link.descriptionKey) }}</p>
          </button>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  width: min(960px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 0.2rem;
}

h1 {
  margin: 0;
}

.ghost {
  border: 1px solid #cbd5f5;
  border-radius: 0.75rem;
  padding: 0.6rem 1.2rem;
  background: #fff;
  cursor: pointer;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
}

.stat-label {
  color: #475569;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0.3rem 0 0;
}

.panel {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.panel-link {
  font-weight: 600;
  color: #0f172a;
}

.panel ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.panel li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.8rem 0;
}

.panel li:last-child {
  border-bottom: none;
}

.panel span {
  color: #64748b;
}

.profile-panel {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.profile-name {
  margin: 0;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.action-card {
  display: block;
  text-align: left;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.action-button {
  width: 100%;
  cursor: pointer;
}

.action-label {
  font-weight: 700;
  margin: 0 0 0.35rem;
}

.action-description,
.muted,
.compact {
  color: #64748b;
}

.compact {
  margin: 0.2rem 0 0;
}

.status.error {
  color: #dc2626;
}
</style>
