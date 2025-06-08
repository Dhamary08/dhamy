import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { city, lat, lon } = query;

  // API Key - en producción debería estar en variables de entorno
  const API_KEY =
    process.env.OPENWEATHER_API_KEY || "b337851b26efb2dcde1d47cd130ba016";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  try {
    let url;
    if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
    } else if (city) {
      url = `${BASE_URL}/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=es`;
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: "Se requiere ciudad o coordenadas",
      });
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw createError({
          statusCode: 401,
          statusMessage:
            "API key inválida. Por favor configura una API key válida de OpenWeatherMap.",
        });
      }
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Ciudad no encontrada",
        });
      }
      throw createError({
        statusCode: response.status,
        statusMessage: `Error de la API del clima: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Si hay error con la API real, devolver datos de ejemplo
    if (API_KEY === "demo_key") {
      console.warn(
        "Usando datos de ejemplo para el clima - configura OPENWEATHER_API_KEY"
      );
      return getMockWeatherData(city || "Madrid");
    }

    throw error;
  }
});

// Datos de ejemplo para cuando no hay API key configurada
function getMockWeatherData(city = "Madrid") {
  return {
    coord: { lon: -3.7026, lat: 40.4165 },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "cielo claro",
        icon: "01d",
      },
    ],
    base: "stations",
    main: {
      temp: 22.5,
      feels_like: 24.2,
      temp_min: 18.3,
      temp_max: 26.1,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: {
      speed: 3.2,
      deg: 180,
    },
    clouds: {
      all: 0,
    },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 2,
      id: 2032,
      country: "ES",
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 7200,
    },
    timezone: 3600,
    id: 3117735,
    name: city,
    cod: 200,
  };
}
