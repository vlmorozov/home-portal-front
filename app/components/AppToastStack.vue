<script setup lang="ts">
const { toasts, dismissToast } = useToast();
</script>

<template>
  <div v-if="toasts.length" class="toast-stack" aria-live="polite" aria-atomic="true">
    <article
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-card"
      :class="toast.kind"
    >
      <p>{{ toast.message }}</p>
      <button type="button" class="toast-close" @click="dismissToast(toast.id)">
        ×
      </button>
    </article>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 70;
  display: grid;
  gap: 0.75rem;
  width: min(360px, calc(100vw - 2rem));
}

.toast-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  color: #0f172a;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
  background: #fff;
  border: 1px solid #e2e8f0;
}

.toast-card.success {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.toast-card.error {
  background: #fef2f2;
  border-color: #fecaca;
}

.toast-card.info {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.toast-card p {
  margin: 0;
  line-height: 1.45;
}

.toast-close {
  border: none;
  background: transparent;
  color: #475569;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
}
</style>
