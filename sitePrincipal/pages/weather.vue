<template>
  <div class="weather-page">
    <section class="section">
      <div class="container">
        <h1 class="section-title">Clima</h1>
        <p class="weather-intro">
          Consulta el clima actual de cualquier ciudad del mundo o usa tu
          ubicación actual.
        </p>

        <WeatherSearch
          :loading="loading"
          @search="handleCitySearch"
          @location-search="handleLocationSearch"
        />

        <div class="weather-content">
          <WeatherCard
            :weather="currentWeather"
            :loading="loading"
            :error="error"
          />

          <div v-if="currentWeather && !loading" class="additional-info">
            <button
              @click="loadForecast"
              class="btn"
              :disabled="loadingForecast"
            >
              {{ loadingForecast ? "Cargando..." : "Ver pronóstico de 5 días" }}
            </button>
          </div>

          <div v-if="forecast" class="forecast-section">
            <h2>Pronóstico de 5 días</h2>
            <div class="forecast-grid">
              <div
                v-for="item in dailyForecast"
                :key="item.dt"
                class="forecast-item"
              >
                <div class="forecast-date">
                  {{ formatForecastDate(item.dt) }}
                </div>
                <img
                  :src="getWeatherIcon(item.weather[0].icon)"
                  :alt="item.weather[0].description"
                  class="forecast-icon"
                />
                <div class="forecast-temps">
                  <span class="temp-max"
                    >{{ formatTemperature(item.main.temp_max) }}°</span
                  >
                  <span class="temp-min"
                    >{{ formatTemperature(item.main.temp_min) }}°</span
                  >
                </div>
                <div class="forecast-desc">
                  {{ item.weather[0].description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useWeather } from "~/composables/useWeather";
import { useSeo } from "~/composables/useSeo";
import WeatherCard from "~/components/WeatherCard.vue";
import WeatherSearch from "~/components/WeatherSearch.vue";

// SEO
useSeo({
  title: "Clima",
  description:
    "Consulta el clima actual y pronóstico de cualquier ciudad del mundo",
  url: "https://mypresentation.com/weather",
});

const {
  currentWeather,
  forecast,
  loading,
  error,
  //state,
  fetchWeatherByCity,
  fetchWeatherByLocation,
  fetchForecast,
  formatTemperature,
  //formatDate,
  getWeatherIcon,
} = useWeather();

const loadingForecast = ref(false);

// Procesar pronóstico para mostrar solo un elemento por día
const dailyForecast = computed(() => {
  if (!forecast.value) return [];

  const daily = {};
  forecast.value.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  return Object.values(daily).slice(0, 5);
});

async function handleCitySearch(city) {
  await fetchWeatherByCity(city);
}

async function handleLocationSearch() {
  await fetchWeatherByLocation();
}

async function loadForecast() {
  if (!currentWeather.value) return;

  loadingForecast.value = true;
  try {
    await fetchForecast(currentWeather.value.name);
  } finally {
    loadingForecast.value = false;
  }
}

function formatForecastDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Cargar clima de Madrid por defecto al montar el componente
onMounted(() => {
  if (!currentWeather.value) {
    fetchWeatherByCity("Madrid");
  }
});
</script>

<style scoped>
.weather-intro {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem;
  color: #666;
}

.weather-content {
  max-width: 800px;
  margin: 0 auto;
}

.additional-info {
  text-align: center;
  margin: 2rem 0;
}

.forecast-section {
  margin-top: 3rem;
}

.forecast-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.forecast-item {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.forecast-item:hover {
  transform: translateY(-5px);
}

.forecast-date {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.forecast-icon {
  width: 50px;
  height: 50px;
  margin: 0.5rem 0;
}

.forecast-temps {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.temp-max {
  font-weight: 600;
  color: #333;
}

.temp-min {
  color: #666;
}

.forecast-desc {
  font-size: 0.9rem;
  color: #666;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .forecast-grid {
    grid-template-columns: 1fr;
  }
}
</style>
