import { ref } from "vue";

// Por esta función helper:
async function fetchAPI(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
}

export function useAI() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Envía un mensaje al chatbot
   */
  async function sendChatMessage(message, context = "general") {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchAPI("/api/ai/chat", {
        method: "POST",
        body: { message, context },
      });
      return response;
    } catch (err) {
      error.value = err.message || "Error al comunicarse con el chatbot";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Genera contenido con IA
   */
  async function generateContent(type, prompt, options = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchAPI("/api/ai/generate-content", {
        method: "POST",
        body: {
          type,
          prompt,
          language: options.language || "es",
          tone: options.tone || "professional",
        },
      });
      return response;
    } catch (err) {
      error.value = err.message || "Error al generar contenido";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Analiza texto con IA
   */
  async function analyzeText(text) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchAPI("/api/ai/analyze-text", {
        method: "POST",
        body: { text },
      });
      return response;
    } catch (err) {
      error.value = err.message || "Error al analizar texto";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    sendChatMessage,
    generateContent,
    analyzeText,
  };
}
