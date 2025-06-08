<template>
  <div class="weather-card">
    <div v-if="loading" class="loading">
      <p>{{ t("weather.loadingWeather") }}</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="weather" class="weather-content">
      <!-- Aviso de datos de ejemplo -->
      <div v-if="isUsingMockData" class="demo-notice">
        <p>{{ t("weather.demoDataNotice") }}</p>
      </div>

      <div class="weather-header">
        <h2 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h2>
        <p class="weather-date">{{ formatDate(weather.dt) }}</p>
      </div>

      <div class="weather-main">
        <div class="temperature-section">
          <img
            :src="getWeatherIcon(weather.weather[0].icon)"
            :alt="weather.weather[0].description"
            class="weather-icon"
          />
          <div class="temperature">
            <span class="temp-value">{{
              formatTemperature(weather.main.temp)
            }}</span>
            <span class="temp-unit">°C</span>
          </div>
        </div>

        <div class="weather-description">
          <p class="description">{{ weather.weather[0].description }}</p>
          <p class="feels-like">
            {{ t("weather.feelsLike") }}:
            {{ formatTemperature(weather.main.feels_like) }}°C
          </p>
        </div>
      </div>

      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">{{ t("weather.humidity") }}</span>
          <span class="detail-value">{{ weather.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t("weather.wind") }}</span>
          <span class="detail-value">{{ weather.wind.speed }} m/s</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t("weather.pressure") }}</span>
          <span class="detail-value">{{ weather.main.pressure }} hPa</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t("weather.visibility") }}</span>
          <span class="detail-value"
            >{{ (weather.visibility / 1000).toFixed(1) }} km</span
          >
        </div>
      </div>

      <div class="sun-times">
        <div class="sun-time">
          <span class="sun-label">🌅 {{ t("weather.sunrise") }}</span>
          <span class="sun-value">{{ formatTime(weather.sys.sunrise) }}</span>
        </div>
        <div class="sun-time">
          <span class="sun-label">🌇 {{ t("weather.sunset") }}</span>
          <span class="sun-value">{{ formatTime(weather.sys.sunset) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWeather } from "~/composables/useWeather";
import { useI18n } from "~/composables/useI18n"; // moved inside the conditional

defineProps({
  weather: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  isUsingMockData: {
    type: Boolean,
    default: false,
  },
});

const { t: i18nTranslate } = useI18n();
const t = i18nTranslate;

const { formatTemperature, formatDate, formatTime, getWeatherIcon } =
  useWeather();
</script>

<style scoped>
.weather-card {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-hover) 100%
  );
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
}

.demo-notice {
  background-color: rgba(255, 193, 7, 0.9);
  color: #333;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.error {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffcdd2;
}

.weather-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.city-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.weather-date {
  opacity: 0.8;
  text-transform: capitalize;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.temperature-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.temperature {
  display: flex;
  align-items: baseline;
}

.temp-value {
  font-size: 3rem;
  font-weight: 300;
}

.temp-unit {
  font-size: 1.5rem;
  margin-left: 0.25rem;
}

.weather-description {
  text-align: right;
}

.description {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.feels-like {
  opacity: 0.8;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  opacity: 0.8;
}

.detail-value {
  font-weight: 600;
}

.sun-times {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.sun-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.sun-label {
  opacity: 0.8;
  font-size: 0.9rem;
}

.sun-value {
  font-weight: 600;
}

@media (max-width: 768px) {
  .weather-main {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .weather-description {
    text-align: center;
  }

  .weather-details {
    grid-template-columns: 1fr;
  }

  .sun-times {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
