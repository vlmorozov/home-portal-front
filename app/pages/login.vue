<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { FetchError } from 'ofetch';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const { t } = useI18n();
const { loginWithEmail } = useAuth();
const email = ref('');
const password = ref('');
const loading = ref(false);
const message = ref('');
const errorMessage = ref('');

const buttonLabel = computed(() =>
  loading.value
    ? (t('login.buttonLoading') as string)
    : (t('login.button') as string)
);

const resolveErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string; error?: string }>;
  return (
    fetchError?.response?._data?.message ||
    fetchError?.response?._data?.error ||
    (t('login.errors.unexpected') as string)
  );
};

const handleLogin = async () => {
  message.value = '';
  errorMessage.value = '';
  if (!email.value || !password.value) {
    errorMessage.value = t('login.errors.required') as string;
    return;
  }

  loading.value = true;
  try {
    await loginWithEmail({ email: email.value, password: password.value });
    message.value = t('login.success') as string;
    setTimeout(() => router.push('/dashboard'), 500);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="card">
    <div>
      <p class="eyebrow">{{ t('login.eyebrow') }}</p>
      <h1>{{ t('login.heading') }}</h1>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <label>
        {{ t('login.emailLabel') }}
        <input
          v-model="email"
          type="email"
          :placeholder="t('login.emailPlaceholder') as string"
          required
        />
      </label>

      <label>
        {{ t('login.passwordLabel') }}
        <input
          v-model="password"
          type="password"
          :placeholder="t('login.passwordPlaceholder') as string"
          required
        />
      </label>

      <button type="submit" :disabled="loading">
        {{ buttonLabel }}
      </button>
    </form>

    <p class="helper">
      {{ t('login.helper') }}
      <NuxtLink to="/register">{{ t('login.helperLink') }}</NuxtLink>
    </p>

    <p v-if="message" class="status success">{{ message }}</p>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.card {
  width: min(420px, 100%);
  background: #ffffff;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 0.2rem;
}

h1 {
  font-size: 1.6rem;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.95rem;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

input {
  border: 1px solid #cbd5f5;
  border-radius: 0.75rem;
  padding: 0.8rem;
  font-size: 1rem;
}

button {
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 0.85rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background: #1d4ed8;
}

.helper {
  font-size: 0.95rem;
  color: #475569;
}

.helper a {
  font-weight: 600;
}

.status {
  font-size: 0.9rem;
}

.success {
  color: #059669;
}

.error {
  color: #dc2626;
}
</style>
