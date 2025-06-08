<template>
  <div class="ui-card" :class="{ 'ui-card--hover': hover }">
    <div v-if="$slots.header" class="ui-card__header">
      <slot name="header" />
    </div>
    <div class="ui-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  hover: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.ui-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ui-card--hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.ui-card__header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.ui-card__body {
  padding: 1.5rem;
}

.ui-card__footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}
</style>
