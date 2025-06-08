<template>
  <div class="theme-toggle">
    <button
      @click="toggleTheme"
      class="theme-toggle-button"
      :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
      :title="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
    >
      <span class="theme-icon">
        {{ isDark ? "☀️" : "🌙" }}
      </span>
      <span class="theme-text">
        {{ isDark ? "Claro" : "Oscuro" }}
      </span>
    </button>

    <!-- Dropdown para selección avanzada de tema -->
    <div
      v-if="showAdvanced"
      class="theme-dropdown"
      :class="{ open: dropdownOpen }"
    >
      <button @click="toggleDropdown" class="theme-dropdown-trigger">
        <span class="dropdown-icon">⚙️</span>
      </button>

      <div v-if="dropdownOpen" class="theme-dropdown-menu">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          @click="selectTheme(option.value)"
          class="theme-option"
          :class="{ active: theme === option.value }"
        >
          <span class="option-icon">{{ option.icon }}</span>
          <span class="option-text">{{ option.label }}</span>
          <span v-if="theme === option.value" class="option-check">✓</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "~/composables/useTheme";

defineProps({
  showAdvanced: {
    type: Boolean,
    default: false,
  },
});

const { theme, isDark, toggleTheme, setTheme } = useTheme();

const dropdownOpen = ref(false);

const themeOptions = [
  { value: "light", label: "Claro", icon: "☀️" },
  { value: "dark", label: "Oscuro", icon: "🌙" },
  { value: "system", label: "Sistema", icon: "💻" },
];

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectTheme(newTheme) {
  setTheme(newTheme);
  dropdownOpen.value = false;
}

// Cerrar dropdown al hacer click fuera
function handleClickOutside(event) {
  if (!event.target.closest(".theme-dropdown")) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.theme-toggle-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
}

.theme-toggle-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.theme-icon {
  font-size: 1.2rem;
  transition: transform var(--transition-fast);
}

.theme-toggle-button:hover .theme-icon {
  transform: scale(1.1);
}

.theme-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.theme-dropdown {
  position: relative;
}

.theme-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-dropdown-trigger:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.dropdown-icon {
  font-size: 0.9rem;
}

.theme-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: var(--shadow-lg);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--color-text-primary);
}

.theme-option:hover {
  background-color: var(--color-surface-hover);
}

.theme-option.active {
  background-color: var(--color-primary);
  color: white;
}

.option-icon {
  font-size: 1rem;
}

.option-text {
  flex: 1;
  text-align: left;
  font-size: 0.9rem;
}

.option-check {
  font-size: 0.8rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .theme-text {
    display: none;
  }

  .theme-toggle-button {
    padding: 0.5rem;
  }
}
</style>
