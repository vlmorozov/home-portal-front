<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale, availableLocales } = useI18n();

const localeLabels: Record<string, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский'
};

const localeOptions = computed(() =>
  availableLocales.map((code) => ({
    code,
    label: localeLabels[code] ?? code
  }))
);

const onLocaleChange = (event: Event) => {
  const { value } = event.target as HTMLSelectElement;
  locale.value = value;
};
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <NuxtLink to="/" class="logo">{{ t('layout.appName') }}</NuxtLink>
      <div class="header-controls">
        <nav>
          <NuxtLink to="/login" class="nav-link">{{ t('layout.login') }}</NuxtLink>
          <NuxtLink to="/register" class="nav-link">{{ t('layout.register') }}</NuxtLink>
          <NuxtLink to="/dashboard" class="nav-link">{{ t('layout.dashboard') }}</NuxtLink>
          <NuxtLink to="/tasks" class="nav-link">{{ t('layout.tasks') }}</NuxtLink>
        </nav>
        <label class="language-switch">
          <span class="sr-only">{{ t('layout.languageLabel') }}</span>
          <select :value="locale" @change="onLocaleChange" :aria-label="t('layout.languageLabel') as string">
            <option v-for="option in localeOptions" :key="option.code" :value="option.code">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} {{ t('layout.footer') }}</p>
    </footer>
    <AppToastStack />
    <AppConfirmDialog />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at top left, rgba(251, 191, 36, 0.15), transparent 28%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #1f2933;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 2px 18px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-weight: 700;
  font-size: 1.125rem;
}

nav {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
}

.nav-link:hover,
.nav-link:focus-visible {
  background: #f1f5f9;
}

.language-switch select {
  border-radius: 999px;
  border: 1px solid #d7dce4;
  padding: 0.45rem 0.8rem;
  background: #fff;
  font-size: 0.95rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

main {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.app-footer {
  padding: 1rem 2rem 1.6rem;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
}

@media (max-width: 860px) {
  .app-header,
  .header-controls {
    display: grid;
  }

  .app-header {
    padding: 1rem 1.2rem;
  }

  main {
    padding: 1.2rem;
  }
}
</style>
