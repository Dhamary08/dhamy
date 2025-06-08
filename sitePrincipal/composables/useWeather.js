import { ref, reactive } from "vue";
import { weatherService } from "~/services/weather";
import { useI18n } from "~/composables/useI18n";

export function useWeather() {
  const { t } = useI18n();

  const currentWeather = ref(null);
  const forecast = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const state = reactive({
    lastSearchedCity: "",
    userLocation: null,
    units: "metric", // metric, imperial, kelvin
    isUsingMockData: false,
  });

  /**
   * Obtiene el clima actual por ciudad
   */
  async function fetchWeatherByCity(city) {
    if (!city.trim()) return;

    loading.value = true;
    error.value = null;
    state.isUsingMockData = false;

    try {
      const data = await weatherService.getCurrentWeather(city);
      currentWeather.value = data;
      state.lastSearchedCity = city;

      // Verificar si estamos usando datos de ejemplo
      if (data.name === city && data.main.temp === 22.5) {
        state.isUsingMockData = true;
      }
    } catch (err) {
      console.error("Error fetching weather:", err);

      if (err.statusCode === 401) {
        error.value = t("weather.errorApiKey");
      } else if (err.statusCode === 404) {
        error.value = t("weather.errorCityNotFound", { city });
      } else {
        error.value = `${t("weather.errorWeather")}: ${
          err.message || err.statusMessage || "Error desconocido"
        }`;
      }

      currentWeather.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene el clima actual por geolocalización
   */
  async function fetchWeatherByLocation() {
    if (!navigator.geolocation) {
      error.value = t("weather.errorGeolocation");
      return;
    }

    loading.value = true;
    error.value = null;
    state.isUsingMockData = false;

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      state.userLocation = { lat: latitude, lon: longitude };

      const data = await weatherService.getCurrentWeatherByCoords(
        latitude,
        longitude
      );
      currentWeather.value = data;
      state.lastSearchedCity = data.name;

      // Verificar si estamos usando datos de ejemplo
      if (data.main.temp === 22.5) {
        state.isUsingMockData = true;
      }
    } catch (err) {
      console.error("Error fetching weather by location:", err);

      if (err.code) {
        // Error de geolocalización
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = t("weather.errorLocationPermission");
            break;
          case err.POSITION_UNAVAILABLE:
            error.value = t("weather.errorLocationUnavailable");
            break;
          case err.TIMEOUT:
            error.value = t("weather.errorLocationTimeout");
            break;
          default:
            error.value = t("weather.errorLocation");
            break;
        }
      } else {
        error.value = `${t("weather.errorLocation")}: ${
          err.message || err.statusMessage || "Error desconocido"
        }`;
      }
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene el pronóstico de 5 días
   */
  async function fetchForecast(city) {
    if (!city.trim()) return;

    loading.value = true;
    error.value = null;

    try {
      const data = await weatherService.getForecast(city);
      forecast.value = data;
    } catch (err) {
      console.error("Error fetching forecast:", err);
      error.value = `${t("weather.errorForecast")}: ${
        err.message || err.statusMessage || "Error desconocido"
      }`;
      forecast.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene la posición actual del usuario
   */
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true,
      });
    });
  }

  /**
   * Formatea la temperatura
   */
  function formatTemperature(temp) {
    return Math.round(temp);
  }

  /**
   * Formatea la fecha
   */
  function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Formatea la hora
   */
  function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Obtiene el icono del clima
   */
  function getWeatherIcon(iconCode) {
    return weatherService.getWeatherIconUrl(iconCode);
  }

  return {
    // Estado
    currentWeather,
    forecast,
    loading,
    error,
    state,

    // Métodos
    fetchWeatherByCity,
    fetchWeatherByLocation,
    fetchForecast,
    formatTemperature,
    formatDate,
    formatTime,
    getWeatherIcon,
  };
}
