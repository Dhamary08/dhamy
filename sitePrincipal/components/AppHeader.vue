<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <NuxtLink to="/">
          <h1>{{ t("common.home") }}</h1>
        </NuxtLink>
      </div>
      <nav class="navigation">
        <ul class="nav-list">
          <li>
            <NuxtLink to="/" class="nav-link">{{ t("common.home") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="nav-link">{{
              t("common.about")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/services" class="nav-link">{{
              t("common.services")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/weather" class="nav-link">{{
              t("common.weather")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/blog" class="nav-link">{{
              t("common.blog")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/ai" class="nav-link ai-link"
              >{{ t("common.ai") }} ✨</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/contact" class="nav-link">{{
              t("common.contact")
            }}</NuxtLink>
          </li>
        </ul>
        <div class="header-actions">
          <LanguageSelector />
          <ThemeToggle :show-advanced="true" />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from "~/composables/useI18n";
import ThemeToggle from "~/components/ThemeToggle.vue";
import LanguageSelector from "~/components/LanguageSelector.vue";

const { t } = useI18n();
</script>

<style scoped>
.header {
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color var(--transition-normal);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary);
}

.ai-link {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }

  .navigation {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .nav-list {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
