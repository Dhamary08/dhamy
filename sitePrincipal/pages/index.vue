<template>
  <div>
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ t("home.title") }}</h1>
          <p class="hero-description">{{ t("home.subtitle") }}</p>
          <div class="hero-buttons">
            <NuxtLink to="/about" class="btn">{{
              t("home.learnMore")
            }}</NuxtLink>
            <NuxtLink to="/contact" class="btn btn-secondary">{{
              t("home.contactUs")
            }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section section">
      <div class="container">
        <h2 class="section-title">{{ t("home.features.title") }}</h2>
        <div class="features-grid">
          <div
            class="feature-card"
            v-for="(feature, index) in features"
            :key="index"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useHead } from "~/app";
import { useI18n } from "~/composables/useI18n";

const { t } = useI18n();

useHead({
  title: t("common.home"),
  meta: [{ name: "description", content: t("home.subtitle") }],
});

const features = computed(() => [
  {
    icon: "🚀",
    title: t("home.features.performance.title"),
    description: t("home.features.performance.description"),
  },
  {
    icon: "🎨",
    title: t("home.features.design.title"),
    description: t("home.features.design.description"),
  },
  {
    icon: "📱",
    title: t("home.features.responsive.title"),
    description: t("home.features.responsive.description"),
  },
  {
    icon: "🔍",
    title: t("home.features.seo.title"),
    description: t("home.features.seo.description"),
  },
]);
</script>

<style scoped>
.hero-section {
  background-color: var(--color-primary);
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-hover) 100%
  );
  padding: 6rem 0;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-buttons .btn {
  color: var(--color-primary);
  background-color: white;
}

.hero-buttons .btn:hover {
  background-color: #f0f0f0;
}

.hero-buttons .btn-secondary {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.hero-buttons .btn-secondary:hover {
  background-color: white;
  color: var(--color-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.feature-description {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
