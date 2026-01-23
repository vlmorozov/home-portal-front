<script setup lang="ts">
const { accessToken, fetchProfile } = useAuth();

if (!accessToken.value) {
  try {
    await fetchProfile();
  } catch {
    // ignore auth failures, we'll send user to login
  }
}

const target = accessToken.value ? '/dashboard' : '/login';
await navigateTo(target, { replace: true });
</script>

<template>
  <div class="redirecting">Redirecting...</div>
</template>
