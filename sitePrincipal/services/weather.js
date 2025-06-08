import { fetchApi } from "./api";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
// Para desarrollo, puedes usar esta API key de prueba (limitada)
// En producción, deberías obtener tu propia API key en: https://openweathermap.org/api
const API_KEY = "b337851b26efb2dcde1d47cd130ba016"; // Reemplaza con tu API key real

export const weatherService = {
  /**
   * Obtiene el clima actual por nombre de ciudad
   */
  async getCurrentWeather(city) {
    return await fetchApi(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
  },

  /**
   * Obtiene el clima actual por coordenadas
   */
  async getCurrentWeatherByCoords(lat, lon) {
    return await fetchApi(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
    );
  },

  /**
   * Obtiene el pronóstico de 5 días
   */
  async getForecast(city) {
    return await fetchApi(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
  },

  /**
   * Obtiene el pronóstico por coordenadas
   */
  async getForecastByCoords(lat, lon) {
    return await fetchApi(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
    );
  },

  /**
   * Obtiene la URL del icono del clima
   */
  getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
