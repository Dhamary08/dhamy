<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
    <ChatBot />
  </div>
</template>

<script setup>
import { useTheme } from "~/composables/useTheme";
import { useI18n } from "~/composables/useI18n";
import ChatBot from "~/components/ai/ChatBot.vue";

const { initializeTheme } = useTheme();
const { initializeLocale } = useI18n();

// Asegurar que el tema y el idioma se inicialicen correctamente
initializeTheme();
initializeLocale();
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
  transition: background-color var(--transition-normal);
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>
