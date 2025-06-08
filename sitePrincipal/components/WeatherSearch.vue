<template>
  <div class="weather-search">
    <div class="search-container">
      <div class="search-input-group">
        <input
          v-model="searchCity"
          type="text"
          placeholder="Buscar ciudad..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" :disabled="loading" @click="handleSearch">
          🔍
        </button>
      </div>

      <button
        class="location-button"
        :disabled="loading"
        @click="handleLocationSearch"
      >
        📍 Mi ubicación
      </button>
    </div>

    <div v-if="suggestions.length > 0" class="suggestions">
      <button
        v-for="city in suggestions"
        :key="city"
        @click="selectSuggestion(city)"
        class="suggestion-item"
      >
        {{ city }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["search", "location-search"]);

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const searchCity = ref("");

// Ciudades populares para sugerencias
const popularCities = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Bilbao",
  "Málaga",
  "Zaragoza",
  "Murcia",
  "Palma",
  "Las Palmas",
  "México",
  "Buenos Aires",
  "Lima",
  "Bogotá",
  "Santiago",
  "Caracas",
  "Quito",
  "La Paz",
  "Montevideo",
  "Asunción",
];

const suggestions = computed(() => {
  if (!searchCity.value || searchCity.value.length < 2) return [];

  return popularCities
    .filter((city) =>
      city.toLowerCase().includes(searchCity.value.toLowerCase())
    )
    .slice(0, 5);
});

function handleSearch() {
  if (searchCity.value.trim()) {
    emit("search", searchCity.value.trim());
  }
}

function handleLocationSearch() {
  emit("location-search");
}

function selectSuggestion(city) {
  searchCity.value = city;
  emit("search", city);
}
</script>

<style scoped>
.weather-search {
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-button {
  padding: 0.75rem 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.search-button:hover:not(:disabled) {
  background-color: #0052a3;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-button {
  padding: 0.75rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.location-button:hover:not(:disabled) {
  background-color: #218838;
}

.location-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-item {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background-color: #e9ecef;
  border-color: #0066cc;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }

  .location-button {
    white-space: normal;
  }
}
</style>
