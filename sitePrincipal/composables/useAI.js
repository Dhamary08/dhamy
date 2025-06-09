import { ref } from "vue";

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
      const response = await fetch("/api/ai/chat", {
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
      const body = {
        type,
        prompt,
        language: options.language || "es",
        tone: options.tone || "professional",
      };

      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log(response, "aqui ver respuesta");
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
      const response = await fetch("/api/ai/analyze-text", {
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
