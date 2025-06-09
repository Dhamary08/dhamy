<template>
  <div class="ai-page">
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ t("ai.title") }}</h1>
          <p class="hero-description">{{ t("ai.description") }}</p>
        </div>
      </div>
    </section>

    <section class="features-section section">
      <div class="container">
        <h2 class="section-title">{{ t("ai.features.title") }}</h2>
        <div class="features-grid">
          <div
            v-for="(feature, index) in aiFeatures"
            :key="index"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <button class="feature-button" @click="selectFeature(feature.id)">
              {{ t("ai.tryFeature") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section section">
      <div class="container">
        <div
          v-if="selectedFeature === 'content-generator'"
          class="demo-content"
        >
          <ContentGenerator />
        </div>

        <div
          v-else-if="selectedFeature === 'text-analyzer'"
          class="demo-content"
        >
          <TextAnalyzer />
        </div>

        <div v-else class="demo-placeholder">
          <div class="placeholder-content">
            <h3>{{ t("ai.selectFeature") }}</h3>
            <p>{{ t("ai.selectFeatureDescription") }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "~/composables/useI18n";
import ContentGenerator from "~/components/ai/ContentGenerator.vue";
import TextAnalyzer from "~/components/ai/TextAnalyzer.vue";
import { useHead } from "@vueuse/head";

const { t } = useI18n();

const selectedFeature = ref(null);

const aiFeatures = computed(() => [
  {
    id: "content-generator",
    icon: "✍️",
    title: t("ai.features.contentGenerator.title"),
    description: t("ai.features.contentGenerator.description"),
  },
  {
    id: "text-analyzer",
    icon: "🔍",
    title: t("ai.features.textAnalyzer.title"),
    description: t("ai.features.textAnalyzer.description"),
  },
  {
    id: "chatbot",
    icon: "🤖",
    title: t("ai.features.chatbot.title"),
    description: t("ai.features.chatbot.description"),
  },
]);

function selectFeature(featureId) {
  selectedFeature.value =
    selectedFeature.value === featureId ? null : featureId;
}

// SEO
useHead({
  title: t("ai.title"),
  meta: [{ name: "description", content: t("ai.description") }],
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.feature-description {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.feature-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color var(--transition-fast);
}

.feature-button:hover {
  background-color: var(--color-primary-hover);
}

.demo-section {
  background-color: var(--color-background);
}

.demo-content {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.demo-placeholder {
  text-align: center;
  padding: 4rem 2rem;
}

.placeholder-content h3 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.placeholder-content p {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
