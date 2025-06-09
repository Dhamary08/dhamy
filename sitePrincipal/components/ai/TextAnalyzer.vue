<template>
  <div class="text-analyzer">
    <div class="analyzer-header">
      <h2>{{ t("ai.textAnalyzer.title") }}</h2>
      <p>{{ t("ai.textAnalyzer.description") }}</p>
    </div>

    <div class="analyzer-form">
      <div class="form-group">
        <label for="text-input">{{ t("ai.textAnalyzer.inputLabel") }}</label>
        <textarea
          id="text-input"
          v-model="textToAnalyze"
          :placeholder="t('ai.textAnalyzer.inputPlaceholder')"
          class="text-input"
          rows="8"
        ></textarea>
      </div>

      <button
        @click="analyzeText"
        :disabled="!textToAnalyze.trim() || loading"
        class="analyze-button"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{
          loading
            ? t("ai.textAnalyzer.analyzing")
            : t("ai.textAnalyzer.analyze")
        }}
      </button>
    </div>

    <div v-if="analysisResult" class="analysis-results">
      <div class="results-header">
        <h3>{{ t("ai.textAnalyzer.results") }}</h3>
        <button @click="clearAnalysis" class="clear-button">
          {{ t("ai.contentGenerator.clear") }}
        </button>
      </div>

      <div class="results-grid">
        <!-- Sentimiento -->
        <div class="result-card sentiment-card">
          <div class="card-header">
            <span class="card-icon">{{
              getSentimentIcon(analysisResult.sentiment)
            }}</span>
            <h4>{{ t("ai.textAnalyzer.sentiment") }}</h4>
          </div>
          <div class="card-content">
            <div class="sentiment-info">
              <span class="sentiment-label" :class="analysisResult.sentiment">
                {{
                  t(`ai.textAnalyzer.sentiments.${analysisResult.sentiment}`)
                }}
              </span>
              <div class="sentiment-score">
                <div class="score-bar">
                  <div
                    class="score-fill"
                    :class="analysisResult.sentiment"
                    :style="{
                      width: `${(analysisResult.sentimentScore + 1) * 50}%`,
                    }"
                  ></div>
                </div>
                <span class="score-value">{{
                  analysisResult.sentimentScore.toFixed(2)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Palabras clave -->
        <div class="result-card keywords-card">
          <div class="card-header">
            <span class="card-icon">🏷️</span>
            <h4>{{ t("ai.textAnalyzer.keywords") }}</h4>
          </div>
          <div class="card-content">
            <div class="keywords-list">
              <span
                v-for="keyword in analysisResult.keywords"
                :key="keyword"
                class="keyword-tag"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>

        <!-- Idioma y legibilidad -->
        <div class="result-card metrics-card">
          <div class="card-header">
            <span class="card-icon">📊</span>
            <h4>{{ t("ai.textAnalyzer.metrics") }}</h4>
          </div>
          <div class="card-content">
            <div class="metric-item">
              <span class="metric-label"
                >{{ t("ai.textAnalyzer.language") }}:</span
              >
              <span class="metric-value">{{
                getLanguageName(analysisResult.language)
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label"
                >{{ t("ai.textAnalyzer.readability") }}:</span
              >
              <div class="readability-score">
                <div class="readability-bar">
                  <div
                    class="readability-fill"
                    :style="{ width: `${analysisResult.readabilityScore}%` }"
                  ></div>
                </div>
                <span class="readability-value"
                  >{{ analysisResult.readabilityScore }}/100</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="result-card summary-card full-width">
          <div class="card-header">
            <span class="card-icon">📝</span>
            <h4>{{ t("ai.textAnalyzer.summary") }}</h4>
          </div>
          <div class="card-content">
            <p class="summary-text">{{ analysisResult.summary }}</p>
          </div>
        </div>

        <!-- Sugerencias -->
        <div class="result-card suggestions-card full-width">
          <div class="card-header">
            <span class="card-icon">💡</span>
            <h4>{{ t("ai.textAnalyzer.suggestions") }}</h4>
          </div>
          <div class="card-content">
            <ul class="suggestions-list">
              <li
                v-for="suggestion in analysisResult.suggestions"
                :key="suggestion"
                class="suggestion-item"
              >
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
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
const { analyzeText: analyzeAIText, loading, error } = useAI();

const textToAnalyze = ref("");
const analysisResult = ref(null);

async function analyzeText() {
  if (!textToAnalyze.value.trim()) return;

  try {
    const result = await analyzeAIText(textToAnalyze.value);
    analysisResult.value = result.analysis;
  } catch (err) {
    console.error("Error analyzing text:", err);
  }
}

function clearAnalysis() {
  analysisResult.value = null;
  textToAnalyze.value = "";
}

function getSentimentIcon(sentiment) {
  const icons = {
    positive: "😊",
    negative: "😞",
    neutral: "😐",
  };
  return icons[sentiment] || "😐";
}

function getLanguageName(langCode) {
  const languages = {
    es: "Español",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    it: "Italiano",
    pt: "Português",
    ru: "Русский",
    zh: "中文",
    ja: "日本語",
    ko: "한국어",
    ar: "العربية",
  };
  return languages[langCode] || langCode.toUpperCase();
}
</script>

<style scoped>
.text-analyzer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.analyzer-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analyzer-header h2 {
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.analyzer-header p {
  color: var(--color-text-secondary);
}

.analyzer-form {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 200px;
  transition: border-color var(--transition-fast);
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.analyze-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.analyze-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.analyze-button:disabled {
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

.analysis-results {
  background-color: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.results-header h3 {
  margin: 0;
  color: var(--color-text-primary);
}

.clear-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.result-card {
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 1.5rem;
}

.card-header h4 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
}

.sentiment-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sentiment-label {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  text-transform: capitalize;
}

.sentiment-label.positive {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.sentiment-label.negative {
  background-color: #ffebee;
  color: #c62828;
}

.sentiment-label.neutral {
  background-color: #f5f5f5;
  color: #666;
}

.sentiment-score {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-bar {
  flex: 1;
  height: 8px;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.score-fill.positive {
  background-color: #4caf50;
}

.score-fill.negative {
  background-color: #f44336;
}

.score-fill.neutral {
  background-color: #9e9e9e;
}

.score-value {
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 3rem;
  text-align: right;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  background-color: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-item:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.metric-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.readability-score {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  margin-left: 1rem;
}

.readability-bar {
  flex: 1;
  height: 6px;
  background-color: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.readability-fill {
  height: 100%;
  background: linear-gradient(90deg, #f44336 0%, #ff9800 50%, #4caf50 100%);
  transition: width 0.5s ease;
}

.readability-value {
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 3.5rem;
  text-align: right;
  font-size: 0.9rem;
}

.summary-text {
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border-left: 3px solid var(--color-primary);
  color: var(--color-text-primary);
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .text-analyzer {
    padding: 1rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .sentiment-score {
    flex-direction: column;
    align-items: stretch;
  }

  .metric-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .readability-score {
    margin-left: 0;
  }
}
</style>
