import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { city, lat, lon } = query;

  // API Key - en producción debería estar en variables de entorno
  const API_KEY = process.env.OPENWEATHER_API_KEY || "demo_key"; // Usa una clave de demo si no está configurada
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  try {
    let url;
    if (lat && lon) {
      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
    } else if (city) {
      url = `${BASE_URL}/forecast?q=${encodeURIComponent(
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
        "Usando datos de ejemplo para el pronóstico - configura OPENWEATHER_API_KEY"
      );
      return getMockForecastData(city || "Madrid");
    }

    throw error;
  }
});

// Datos de ejemplo para el pronóstico
function getMockForecastData(city = "Madrid") {
  const baseTime = Math.floor(Date.now() / 1000);
  const list = [];

  // Generar 40 elementos (5 días x 8 mediciones por día)
  for (let i = 0; i < 40; i++) {
    const temp = 20 + Math.random() * 10; // Temperatura entre 20-30°C
    list.push({
      dt: baseTime + i * 3 * 3600, // Cada 3 horas
      main: {
        temp: Math.round(temp * 10) / 10,
        feels_like: Math.round((temp + 2) * 10) / 10,
        temp_min: Math.round((temp - 2) * 10) / 10,
        temp_max: Math.round((temp + 3) * 10) / 10,
        pressure: 1010 + Math.random() * 20,
        humidity: 50 + Math.random() * 30,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description:
            i % 3 === 0
              ? "cielo claro"
              : i % 3 === 1
              ? "pocas nubes"
              : "nublado",
          icon: i % 3 === 0 ? "01d" : i % 3 === 1 ? "02d" : "03d",
        },
      ],
      clouds: {
        all: Math.floor(Math.random() * 50),
      },
      wind: {
        speed: Math.random() * 5,
        deg: Math.floor(Math.random() * 360),
      },
      visibility: 10000,
      pop: Math.random() * 0.3,
      dt_txt: new Date((baseTime + i * 3 * 3600) * 1000)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19),
    });
  }

  return {
    cod: "200",
    message: 0,
    cnt: 40,
    list,
    city: {
      id: 3117735,
      name: city,
      coord: {
        lat: 40.4165,
        lon: -3.7026,
      },
      country: "ES",
      population: 3255944,
      timezone: 3600,
      sunrise: baseTime - 3600,
      sunset: baseTime + 7200,
    },
  };
}
