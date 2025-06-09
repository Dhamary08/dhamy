<template>
  <div class="content-generator">
    <div class="generator-header">
      <h2>{{ t("ai.contentGenerator.title") }}</h2>
      <p>{{ t("ai.contentGenerator.description") }}</p>
    </div>

    <div class="generator-form">
      <div class="form-group">
        <label for="content-type">{{ t("ai.contentGenerator.type") }}</label>
        <select id="content-type" v-model="selectedType" class="form-select">
          <option value="blog-post">
            {{ t("ai.contentGenerator.types.blogPost") }}
          </option>
          <option value="service-description">
            {{ t("ai.contentGenerator.types.serviceDescription") }}
          </option>
          <option value="meta-description">
            {{ t("ai.contentGenerator.types.metaDescription") }}
          </option>
          <option value="social-media">
            {{ t("ai.contentGenerator.types.socialMedia") }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="content-prompt">{{
          t("ai.contentGenerator.prompt")
        }}</label>
        <textarea
          id="content-prompt"
          v-model="prompt"
          :placeholder="t('ai.contentGenerator.promptPlaceholder')"
          class="form-textarea"
          rows="4"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="content-language">{{
            t("ai.contentGenerator.language")
          }}</label>
          <select
            id="content-language"
            v-model="selectedLanguage"
            class="form-select"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <div class="form-group">
          <label for="content-tone">{{ t("ai.contentGenerator.tone") }}</label>
          <select id="content-tone" v-model="selectedTone" class="form-select">
            <option value="professional">
              {{ t("ai.contentGenerator.tones.professional") }}
            </option>
            <option value="casual">
              {{ t("ai.contentGenerator.tones.casual") }}
            </option>
            <option value="creative">
              {{ t("ai.contentGenerator.tones.creative") }}
            </option>
            <option value="technical">
              {{ t("ai.contentGenerator.tones.technical") }}
            </option>
          </select>
        </div>
      </div>

      <button
        :disabled="!prompt.trim() || loading"
        class="generate-button"
        @click="generateContent"
      >
        <span v-if="loading" class="loading-spinner" />
        {{
          loading
            ? t("ai.contentGenerator.generating")
            : t("ai.contentGenerator.generate")
        }}
      </button>
    </div>

    <div v-if="generatedContent" class="generated-content">
      <div class="content-header">
        <h3>{{ t("ai.contentGenerator.result") }}</h3>
        <div class="content-actions">
          <button class="action-button" @click="copyContent">
            {{
              copied
                ? t("ai.contentGenerator.copied")
                : t("ai.contentGenerator.copy")
            }}
          </button>
          <button class="action-button secondary" @click="clearContent">
            {{ t("ai.contentGenerator.clear") }}
          </button>
        </div>
      </div>

      <div class="content-result">
        <pre>{{ generatedContent.content }}</pre>
      </div>

      <div class="content-meta">
        <span class="meta-item"
          >{{ t("ai.contentGenerator.type") }}:
          {{ generatedContent.type }}</span
        >
        <span class="meta-item"
          >{{ t("ai.contentGenerator.language") }}:
          {{ generatedContent.language }}</span
        >
        <span class="meta-item"
          >{{ t("ai.contentGenerator.tone") }}:
          {{ generatedContent.tone }}</span
        >
      </div>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAI } from "~/composables/useAI";
import { useI18n } from "~/composables/useI18n";

const { t } = useI18n();
const { generateContent: generateAIContent, loading, error } = useAI();

const selectedType = ref("blog-post");
const prompt = ref("");
const selectedLanguage = ref("es");
const selectedTone = ref("professional");
const generatedContent = ref(null);
const copied = ref(false);

async function generateContent() {
  if (!prompt.value.trim()) return;

  try {
    const result = await generateAIContent(selectedType.value, prompt.value, {
      language: selectedLanguage.value,
      tone: selectedTone.value,
    });

    generatedContent.value = result;
  } catch (err) {
    console.error("Error generating content:", err);
  }
}

async function copyContent() {
  if (!generatedContent.value) return;

  try {
    await navigator.clipboard.writeText(generatedContent.value.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Error copying content:", err);
  }
}

function clearContent() {
  generatedContent.value = null;
  prompt.value = "";
}
</script>

<style scoped>
.content-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.generator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.generator-header h2 {
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.generator-header p {
  color: var(--color-text-secondary);
}

.generator-form {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.generate-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.generate-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.generated-content {
  background-color: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.content-header h3 {
  margin: 0;
  color: var(--color-text-primary);
}

.content-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.action-button:hover {
  background-color: var(--color-primary-hover);
}

.action-button.secondary {
  background-color: transparent;
  color: var(--color-primary);
}

.action-button.secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

.content-result {
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.content-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.content-meta {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.meta-item {
  color: var(--color-text-secondary);
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .content-generator {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .content-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .content-actions {
    justify-content: center;
  }

  .content-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
