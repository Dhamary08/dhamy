import { defineNuxtPlugin } from "~/app";
import { useAppStore } from "~/stores/app";

export default defineNuxtPlugin(() => {
  const appStore = useAppStore();

  // Inicializar el tema
  appStore.initializeTheme();

  // Escuchar cambios en la preferencia del sistema
  const cleanup = appStore.watchSystemTheme();

  // Cleanup cuando se desmonte la app
  if (import.meta.client) {
    window.addEventListener("beforeunload", cleanup);
  }
});
