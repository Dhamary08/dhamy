import { defineEventHandler, readBody, createError } from "h3";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const analysisSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  sentimentScore: z.number().min(-1).max(1),
  keywords: z.array(z.string()),
  summary: z.string(),
  language: z.string(),
  readabilityScore: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: "Texto requerido para análisis",
      });
    }

    const systemPrompt = `Analiza el siguiente texto y proporciona:
1. Sentimiento general (positive, negative, neutral)
2. Puntuación de sentimiento (-1 a 1)
3. Palabras clave principales (máximo 10)
4. Resumen breve (máximo 100 palabras)
5. Idioma detectado
6. Puntuación de legibilidad (0-100, donde 100 es muy fácil de leer)
7. Sugerencias de mejora (máximo 5)

Sé preciso y objetivo en tu análisis.`;

    const { object } = await generateObject({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: `Analiza este texto: "${text}"`,
      schema: analysisSchema,
    });

    return {
      analysis: object,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error analizando texto:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Error al analizar texto con IA",
    });
  }
});
