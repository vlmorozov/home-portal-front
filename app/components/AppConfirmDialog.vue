<script setup lang="ts">
const { dialog, close } = useConfirm();
</script>

<template>
  <div v-if="dialog.open" class="confirm-shell" role="presentation">
    <div class="confirm-backdrop" @click="close(false)" />
    <section
      class="confirm-card"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <h2 id="confirm-title">{{ dialog.title }}</h2>
      <p id="confirm-message">{{ dialog.message }}</p>
      <div class="confirm-actions">
        <button type="button" class="ghost" @click="close(false)">
          {{ dialog.cancelLabel }}
        </button>
        <button type="button" class="danger" @click="close(true)">
          {{ dialog.confirmLabel }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.confirm-shell {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.confirm-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.44);
}

.confirm-card {
  position: relative;
  width: min(460px, 100%);
  background: #fff;
  border-radius: 1.3rem;
  padding: 1.35rem;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
}

.confirm-card h2 {
  margin: 0 0 0.5rem;
}

.confirm-card p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.confirm-actions button {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font: inherit;
}

.ghost {
  background: #edf2f7;
  color: #243041;
}

.danger {
  background: #ba3a2d;
  color: #fff;
}
</style>
