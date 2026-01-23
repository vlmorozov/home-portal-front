<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FetchError } from 'ofetch';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const { t } = useI18n();
const { profile, fetchProfile, logout } = useAuth();
const loadingProfile = ref(false);
const profileError = ref('');

const stats = [
  { titleKey: 'dashboard.stats.pendingTasks', value: 12, accent: '#38bdf8' },
  { titleKey: 'dashboard.stats.upcomingMeetings', value: 4, accent: '#fbbf24' },
  { titleKey: 'dashboard.stats.messages', value: 8, accent: '#34d399' }
];

const activities = [
  { titleKey: 'dashboard.activity.kickoff.title', timeKey: 'dashboard.activity.kickoff.time' },
  { titleKey: 'dashboard.activity.review.title', timeKey: 'dashboard.activity.review.time' },
  { titleKey: 'dashboard.activity.payroll.title', timeKey: 'dashboard.activity.payroll.time' }
];

const quickLinks = [
  { labelKey: 'dashboard.actions.profile.label', descriptionKey: 'dashboard.actions.profile.description', to: '/profile' },
  { labelKey: 'dashboard.actions.invite.label', descriptionKey: 'dashboard.actions.invite.description', to: '/register' },
  { labelKey: 'dashboard.actions.signout.label', descriptionKey: 'dashboard.actions.signout.description', action: 'signout' }
];

const resolveProfileError = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string }>;
  return fetchError?.response?._data?.message || '';
};

const loadProfile = async () => {
  profileError.value = '';
  loadingProfile.value = true;
  try {
    await fetchProfile();
  } catch (error) {
    profileError.value = resolveProfileError(error);
  } finally {
    loadingProfile.value = false;
  }
};

const handleSignOut = async () => {
  await logout();
  router.push('/login');
};

onMounted(loadProfile);
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
      <h2>{{ t('dashboard.recentlyActive') }}</h2>
      <ul>
        <li v-for="item in activities" :key="item.titleKey">
          <strong>{{ t(item.titleKey) }}</strong>
          <span>{{ t(item.timeKey) }}</span>
        </li>
      </ul>
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

.panel ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.panel li {
  display: flex;
  justify-content: space-between;
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

.muted {
  color: #475569;
  margin: 0;
}

.eyebrow.small {
  font-size: 0.7rem;
  margin-bottom: 0;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.action-card {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.action-card:hover {
  border-color: #6366f1;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.16);
}

.action-button {
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.action-label {
  font-weight: 600;
}

.action-description {
  color: #475569;
  margin-top: 0.4rem;
}

.status {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.error {
  color: #dc2626;
}
</style>
