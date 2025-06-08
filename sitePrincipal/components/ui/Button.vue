<template>
  <button
    :class="[
      'ui-button',
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--full': full },
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="ui-button__loader" />
    <span
      :class="{ 'ui-button__content--hidden': loading }"
      class="ui-button__content"
    >
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "outline", "text"].includes(value),
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  full: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: none;
}

.ui-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-button--primary {
  background-color: #0066cc;
  color: white;
}

.ui-button--primary:hover:not(:disabled) {
  background-color: #0052a3;
}

.ui-button--secondary {
  background-color: #666;
  color: white;
}

.ui-button--secondary:hover:not(:disabled) {
  background-color: #555;
}

.ui-button--outline {
  background-color: transparent;
  border: 1px solid #0066cc;
  color: #0066cc;
}

.ui-button--outline:hover:not(:disabled) {
  background-color: rgba(0, 102, 204, 0.1);
}

.ui-button--text {
  background-color: transparent;
  color: #0066cc;
  padding-left: 0;
  padding-right: 0;
}

.ui-button--text:hover:not(:disabled) {
  color: #0052a3;
  text-decoration: underline;
}

.ui-button--small {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.ui-button--medium {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

.ui-button--large {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}

.ui-button--full {
  width: 100%;
}

.ui-button__loader {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.ui-button--outline .ui-button__loader,
.ui-button--text .ui-button__loader {
  border: 2px solid rgba(0, 102, 204, 0.3);
  border-top-color: #0066cc;
}

.ui-button__content--hidden {
  visibility: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
