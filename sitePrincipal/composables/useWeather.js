import { ref, reactive } from "vue";
import { weatherService } from "~/services/weather";

export function useWeather() {
  const currentWeather = ref(null);
  const forecast = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const state = reactive({
    lastSearchedCity: "",
    userLocation: null,
    units: "metric", // metric, imperial, kelvin
  });

  /**
   * Obtiene el clima actual por ciudad
   */
  async function fetchWeatherByCity(city) {
    if (!city.trim()) return;

    loading.value = true;
    error.value = null;

    try {
      const data = await weatherService.getCurrentWeather(city);
      currentWeather.value = data;
      state.lastSearchedCity = city;
    } catch (err) {
      error.value = `Error al obtener el clima de ${city}: ${err.message}`;
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
      error.value = "La geolocalización no está disponible en este navegador";
      return;
    }

    loading.value = true;
    error.value = null;

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
    } catch (err) {
      error.value = `Error al obtener ubicación: ${err.message}`;
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
      error.value = `Error al obtener pronóstico: ${err.message}`;
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
