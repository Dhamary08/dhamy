<template>
  <div class="language-selector">
    <button
      class="language-button"
      :aria-label="t('navigation.language')"
      :title="t('navigation.language')"
      @click="toggleDropdown"
    >
      <span class="current-flag">{{ currentLocale.flag }}</span>
      <span class="current-name">{{ currentLocale.name }}</span>
      <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
    </button>

    <div v-if="dropdownOpen" class="language-dropdown">
      <button
        v-for="localeOption in availableLocales"
        :key="localeOption.code"
        class="language-option"
        :class="{ active: locale === localeOption.code }"
        @click="selectLanguage(localeOption.code)"
      >
        <span class="option-flag">{{ localeOption.flag }}</span>
        <span class="option-name">{{ localeOption.name }}</span>
        <span v-if="locale === localeOption.code" class="option-check">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "~/composables/useI18n";

const { locale, availableLocales, setLocale, t } = useI18n();

const dropdownOpen = ref(false);

const currentLocale = computed(() => {
  return (
    availableLocales.find((l) => l.code === locale.value) || availableLocales[0]
  );
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectLanguage(newLocale) {
  setLocale(newLocale);
  dropdownOpen.value = false;
}

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
  if (!event.target.closest(".language-selector")) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.language-selector {
  position: relative;
}

.language-button {
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

.language-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.current-flag {
  font-size: 1.2rem;
}

.current-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform var(--transition-fast);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
}

.language-option {
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

.language-option:hover {
  background-color: var(--color-surface-hover);
}

.language-option.active {
  background-color: var(--color-primary);
  color: white;
}

.option-flag {
  font-size: 1.1rem;
}

.option-name {
  flex: 1;
  text-align: left;
  font-size: 0.9rem;
}

.option-check {
  font-size: 0.8rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .current-name {
    display: none;
  }

  .language-button {
    padding: 0.5rem;
  }
}
</style>
