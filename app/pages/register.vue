<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { FetchError } from 'ofetch';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const { t } = useI18n();
const { registerUser } = useAuth();
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const message = ref('');
const errorMessage = ref('');
const submitting = ref(false);

const buttonLabel = computed(() =>
  submitting.value
    ? (t('register.buttonLoading') as string)
    : (t('register.button') as string)
);

const resolveErrorMessage = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string | string[]; error?: string }>;
  const message = fetchError?.response?._data?.message;
  if (Array.isArray(message)) return message.join(' ');
  return message || fetchError?.response?._data?.error || (t('register.errors.unexpected') as string);
};

const handleRegister = async () => {
  message.value = '';
  errorMessage.value = '';
  if (!form.fullName || !form.email || !form.password) {
    errorMessage.value = t('register.errors.required') as string;
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('register.errors.mismatch') as string;
    return;
  }

  submitting.value = true;
  try {
    await registerUser({
      username: form.fullName.trim(),
      email: form.email,
      password: form.password
    });
    message.value = t('register.success') as string;
    setTimeout(() => router.push('/login'), 600);
  } catch (error) {
    errorMessage.value = resolveErrorMessage(error);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section class="card">
    <div>
      <p class="eyebrow">{{ t('register.eyebrow') }}</p>
      <h1>{{ t('register.heading') }}</h1>
    </div>

    <form @submit.prevent="handleRegister" class="form">
      <label>
        {{ t('register.fullNameLabel') }}
        <input
          v-model="form.fullName"
          type="text"
          :placeholder="t('register.fullNamePlaceholder') as string"
          required
        />
      </label>

      <label>
        {{ t('register.emailLabel') }}
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('register.emailPlaceholder') as string"
          required
        />
      </label>

      <label>
        {{ t('register.passwordLabel') }}
        <input
          v-model="form.password"
          type="password"
          :placeholder="t('register.passwordPlaceholder') as string"
          required
        />
      </label>

      <label>
        {{ t('register.confirmPasswordLabel') }}
        <input
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('register.passwordPlaceholder') as string"
          required
        />
      </label>

      <button type="submit" :disabled="submitting">
        {{ buttonLabel }}
      </button>
    </form>

    <p class="helper">
      {{ t('register.helper') }}
      <NuxtLink to="/login">{{ t('register.helperLink') }}</NuxtLink>
    </p>

    <p v-if="message" class="status success">{{ message }}</p>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.card {
  width: min(520px, 100%);
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
  display: grid;
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
  background: #7c3aed;
  color: #fff;
  font-weight: 600;
  padding: 0.9rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background: #6d28d9;
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
  color: #0f766e;
}

.error {
  color: #dc2626;
}
</style>
