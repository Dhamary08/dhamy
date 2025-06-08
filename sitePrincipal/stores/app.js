import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: "light", // 'light', 'dark', 'system'
    locale: "es", // idioma actual
    isMenuOpen: false,
    notifications: [],
  }),

  getters: {
    isDarkTheme: (state) => {
      if (state.theme === "system") {
        // En el servidor, defaultear a light
        if (import.meta.server) return false;

        // En el cliente, usar la preferencia del sistema
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return state.theme === "dark";
    },

    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
  },

  actions: {
    /**
     * Inicializa el tema desde localStorage o preferencia del sistema
     */
    initializeTheme() {
      if (import.meta.server) return;

      const savedTheme = localStorage.getItem("theme");

      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        this.theme = savedTheme;
      } else {
        // Si no hay preferencia guardada, usar 'system'
        this.theme = "system";
      }

      this.applyTheme();
    },

    /**
     * Inicializa el idioma desde localStorage o preferencia del navegador
     */
    initializeLocale() {
      if (import.meta.server) return;

      const savedLocale = localStorage.getItem("locale");
      const supportedLocales = ["es", "en", "fr"];

      if (savedLocale && supportedLocales.includes(savedLocale)) {
        this.locale = savedLocale;
      } else {
        // Detectar idioma del navegador
        const browserLang = navigator.language.split("-")[0];
        this.locale = supportedLocales.includes(browserLang)
          ? browserLang
          : "es";
      }

      this.applyLocale();
    },

    /**
     * Cambia el idioma
     */
    setLocale(newLocale) {
      const supportedLocales = ["es", "en", "fr"];
      if (!supportedLocales.includes(newLocale)) return;

      this.locale = newLocale;

      if (import.meta.client) {
        localStorage.setItem("locale", newLocale);
        this.applyLocale();
      }
    },

    /**
     * Aplica el idioma al documento
     */
    applyLocale() {
      if (import.meta.server) return;

      document.documentElement.lang = this.locale;
    },

    /**
     * Cambia el tema
     */
    setTheme(newTheme) {
      if (!["light", "dark", "system"].includes(newTheme)) return;

      this.theme = newTheme;

      if (import.meta.client) {
        localStorage.setItem("theme", newTheme);
        this.applyTheme();
      }
    },

    /**
     * Alterna entre light y dark (no incluye system)
     */
    toggleTheme() {
      const currentEffectiveTheme = this.isDarkTheme ? "dark" : "light";
      const newTheme = currentEffectiveTheme === "light" ? "dark" : "light";
      this.setTheme(newTheme);
    },

    /**
     * Aplica el tema al documento
     */
    applyTheme() {
      if (import.meta.server) return;

      const isDark = this.isDarkTheme;
      const htmlElement = document.documentElement;

      if (isDark) {
        htmlElement.classList.add("dark");
        htmlElement.classList.remove("light");
      } else {
        htmlElement.classList.add("light");
        htmlElement.classList.remove("dark");
      }

      // Actualizar meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", isDark ? "#1a1a1a" : "#ffffff");
      }
    },

    /**
     * Escucha cambios en la preferencia del sistema
     */
    watchSystemTheme() {
      if (import.meta.server) return;

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        if (this.theme === "system") {
          this.applyTheme();
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      // Retornar función de cleanup
      return () => mediaQuery.removeEventListener("change", handleChange);
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    addNotification(notification) {
      this.notifications.push({
        id: Date.now(),
        read: false,
        timestamp: new Date(),
        ...notification,
      });
    },

    markNotificationAsRead(id) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    clearNotifications() {
      this.notifications = [];
    },
  },
});
