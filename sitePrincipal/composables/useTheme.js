"use client";

import { computed } from "vue";
import { useAppStore } from "~/stores/app";

export function useTheme() {
  const appStore = useAppStore();

  const theme = computed(() => appStore.theme);
  const isDark = computed(() => appStore.isDarkTheme);

  const setTheme = (newTheme) => {
    appStore.setTheme(newTheme);
  };

  const toggleTheme = () => {
    appStore.toggleTheme();
  };

  const initializeTheme = () => {
    appStore.initializeTheme();
  };

  const watchSystemTheme = () => {
    return appStore.watchSystemTheme();
  };

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme,
    watchSystemTheme,
  };
}
