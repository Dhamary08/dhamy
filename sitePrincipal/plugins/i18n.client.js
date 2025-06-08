import { defineNuxtPlugin } from "~/plugins/app";
import { useAppStore } from "~/stores/app";

export default defineNuxtPlugin(() => {
  const appStore = useAppStore();

  // Inicializar el idioma
  appStore.initializeLocale();
});
