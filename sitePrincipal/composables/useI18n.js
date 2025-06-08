import { computed } from "vue";
import { useAppStore } from "~/stores/app";

// Importar todas las traducciones
import es from "~/locales/es.json";
import en from "~/locales/en.json";
import fr from "~/locales/fr.json";

const translations = {
  es,
  en,
  fr,
};

export function useI18n() {
  const appStore = useAppStore();

  const locale = computed(() => appStore.locale);

  const availableLocales = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  /**
   * Obtiene una traducción por clave
   * @param {string} key - Clave de traducción (ej: 'common.loading')
   * @param {object} params - Parámetros para interpolación
   * @returns {string} - Texto traducido
   */
  function t(key, params = {}) {
    const currentLocale = locale.value;
    const keys = key.split(".");
    let value = translations[currentLocale];

    // Navegar por las claves anidadas
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Si no se encuentra la clave, intentar con el idioma por defecto (español)
        value = translations.es;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key "${key}" not found`);
            return key; // Retornar la clave si no se encuentra la traducción
          }
        }
        break;
      }
    }

    // Si el valor final no es una cadena, retornar la clave
    if (typeof value !== "string") {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // Interpolación simple de parámetros
    let result = value;
    Object.keys(params).forEach((param) => {
      const regex = new RegExp(`{${param}}`, "g");
      result = result.replace(regex, params[param]);
    });

    return result;
  }

  /**
   * Obtiene una traducción de array (para listas)
   * @param {string} key - Clave de traducción que apunta a un array
   * @returns {array} - Array traducido
   */
  function ta(key) {
    const currentLocale = locale.value;
    const keys = key.split(".");
    let value = translations[currentLocale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation array key "${key}" not found`);
        return [];
      }
    }

    return Array.isArray(value) ? value : [];
  }

  /**
   * Cambia el idioma actual
   * @param {string} newLocale - Código del nuevo idioma
   */
  function setLocale(newLocale) {
    appStore.setLocale(newLocale);
  }

  /**
   * Inicializa el idioma
   */
  function initializeLocale() {
    appStore.initializeLocale();
  }

  /**
   * Formatea números según el idioma actual
   * @param {number} number - Número a formatear
   * @param {object} options - Opciones de formateo
   * @returns {string} - Número formateado
   */
  function formatNumber(number, options = {}) {
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      fr: "fr-FR",
    };

    return new Intl.NumberFormat(
      localeMap[locale.value] || "es-ES",
      options
    ).format(number);
  }

  /**
   * Formatea fechas según el idioma actual
   * @param {Date|string|number} date - Fecha a formatear
   * @param {object} options - Opciones de formateo
   * @returns {string} - Fecha formateada
   */
  function formatDate(date, options = {}) {
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      fr: "fr-FR",
    };

    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(
      localeMap[locale.value] || "es-ES",
      options
    ).format(dateObj);
  }

  return {
    locale,
    availableLocales,
    t,
    ta,
    setLocale,
    initializeLocale,
    formatNumber,
    formatDate,
  };
}
