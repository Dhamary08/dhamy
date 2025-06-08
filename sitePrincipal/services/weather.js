import { fetchApi } from "./api";

export const weatherService = {
  /**
   * Obtiene el clima actual por nombre de ciudad
   */
  async getCurrentWeather(city) {
    return await fetchApi(
      `/api/weather/current?city=${encodeURIComponent(city)}`
    );
  },

  /**
   * Obtiene el clima actual por coordenadas
   */
  async getCurrentWeatherByCoords(lat, lon) {
    return await fetchApi(`/api/weather/current?lat=${lat}&lon=${lon}`);
  },

  /**
   * Obtiene el pronóstico de 5 días
   */
  async getForecast(city) {
    return await fetchApi(
      `/api/weather/forecast?city=${encodeURIComponent(city)}`
    );
  },

  /**
   * Obtiene el pronóstico por coordenadas
   */
  async getForecastByCoords(lat, lon) {
    return await fetchApi(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
  },

  /**
   * Obtiene la URL del icono del clima
   */
  getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
