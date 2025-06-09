import { defineEventHandler, readBody, createError } from "h3";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export default defineEventHandler(async (event) => {
  try {
    const {
      type,
      prompt,
      language = "es",
      tone = "professional",
    } = await readBody(event);

    if (!type || !prompt) {
      throw createError({
        statusCode: 400,
        statusMessage: "Tipo y prompt requeridos",
      });
    }

    let systemPrompt = "";
    const userPrompt = prompt;

    switch (type) {
      case "blog-post":
        systemPrompt = `Eres un escritor experto en tecnología y desarrollo web. Genera un artículo de blog profesional y atractivo sobre el tema solicitado. El artículo debe ser informativo, bien estructurado y optimizado para SEO. Incluye una introducción, desarrollo y conclusión. Escribe en ${
          language === "es"
            ? "español"
            : language === "en"
            ? "inglés"
            : "francés"
        } con un tono ${tone}.`;
        break;

      case "service-description":
        systemPrompt = `Eres un copywriter especializado en servicios digitales. Crea una descripción atractiva y persuasiva del servicio solicitado. Debe destacar los beneficios, características principales y valor agregado. Escribe en ${
          language === "es"
            ? "español"
            : language === "en"
            ? "inglés"
            : "francés"
        } con un tono ${tone}.`;
        break;

      case "meta-description":
        systemPrompt = `Genera una meta descripción SEO optimizada de máximo 160 caracteres para el contenido solicitado. Debe ser atractiva, incluir palabras clave relevantes y motivar al click. Escribe en ${
          language === "es"
            ? "español"
            : language === "en"
            ? "inglés"
            : "francés"
        }.`;
        break;

      case "social-media":
        systemPrompt = `Crea contenido atractivo para redes sociales sobre el tema solicitado. Debe ser engaging, incluir emojis relevantes y motivar la interacción. Máximo 280 caracteres. Escribe en ${
          language === "es"
            ? "español"
            : language === "en"
            ? "inglés"
            : "francés"
        } con un tono ${tone}.`;
        break;

      default:
        systemPrompt = `Eres un asistente de escritura profesional. Genera contenido de alta calidad sobre el tema solicitado. Escribe en ${
          language === "es"
            ? "español"
            : language === "en"
            ? "inglés"
            : "francés"
        } con un tono ${tone}.`;
    }

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens:
        type === "meta-description"
          ? 100
          : type === "social-media"
          ? 150
          : 1000,
      temperature: tone === "creative" ? 0.8 : 0.6,
    });

    return {
      content: text,
      type,
      language,
      tone,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.log("Error en la generación de contenido:", error);
    console.error("Error generando contenido:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Error al generar contenido con IA",
    });
  }
});
