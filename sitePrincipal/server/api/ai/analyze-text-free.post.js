import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: "Texto requerido para análisis",
      });
    }

    // Análisis gratuito usando algoritmos simples pero efectivos
    const analysis = analyzeTextLocally(text);

    return {
      analysis,
      timestamp: new Date().toISOString(),
      provider: "local",
    };
  } catch (error) {
    console.error("Error analizando texto:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error al analizar texto",
    });
  }
});

function analyzeTextLocally(text) {
  // Análisis de sentimientos básico
  const sentiment = analyzeSentiment(text);

  // Extracción de palabras clave
  const keywords = extractKeywords(text);

  // Detección de idioma
  const language = detectLanguage(text);

  // Puntuación de legibilidad
  const readabilityScore = calculateReadability(text);

  // Resumen
  const summary = generateSummary(text);

  // Sugerencias
  const suggestions = generateSuggestions(text);

  return {
    sentiment: sentiment.label,
    sentimentScore: sentiment.score,
    keywords,
    summary,
    language,
    readabilityScore,
    suggestions,
  };
}

function analyzeSentiment(text) {
  const positiveWords = [
    "excelente",
    "bueno",
    "genial",
    "fantástico",
    "increíble",
    "perfecto",
    "amazing",
    "great",
    "excellent",
    "fantastic",
    "perfect",
    "wonderful",
    "magnifique",
    "excellent",
    "parfait",
    "formidable",
    "génial",
  ];

  const negativeWords = [
    "malo",
    "terrible",
    "horrible",
    "pésimo",
    "awful",
    "bad",
    "terrible",
    "horrible",
    "mauvais",
    "terrible",
    "horrible",
    "affreux",
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveCount++;
    if (negativeWords.some((nw) => word.includes(nw))) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;

  if (totalSentimentWords === 0) {
    return { label: "neutral", score: 0 };
  }

  const score = (positiveCount - negativeCount) / totalSentimentWords;

  if (score > 0.1) return { label: "positive", score };
  if (score < -0.1) return { label: "negative", score };
  return { label: "neutral", score };
}

function extractKeywords(text) {
  const stopWords = [
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "es",
    "se",
    "no",
    "te",
    "lo",
    "le",
    "da",
    "su",
    "por",
    "son",
    "con",
    "para",
    "al",
    "del",
    "los",
    "las",
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "le",
    "de",
    "et",
    "à",
    "un",
    "il",
    "être",
    "et",
    "en",
    "avoir",
    "que",
    "pour",
    "dans",
    "ce",
    "son",
    "une",
    "sur",
    "avec",
    "ne",
    "se",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word));

  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function detectLanguage(text) {
  const spanishWords = [
    "el",
    "la",
    "de",
    "que",
    "y",
    "es",
    "en",
    "un",
    "para",
    "con",
  ];
  const englishWords = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "for",
  ];
  const frenchWords = [
    "le",
    "de",
    "et",
    "à",
    "un",
    "il",
    "être",
    "que",
    "pour",
    "dans",
  ];

  const words = text.toLowerCase().split(/\s+/);

  const spanishCount = words.filter((word) =>
    spanishWords.includes(word)
  ).length;
  const englishCount = words.filter((word) =>
    englishWords.includes(word)
  ).length;
  const frenchCount = words.filter((word) => frenchWords.includes(word)).length;

  if (spanishCount >= englishCount && spanishCount >= frenchCount) return "es";
  if (englishCount >= frenchCount) return "en";
  return "fr";
}

function calculateReadability(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce(
    (total, word) => total + countSyllables(word),
    0
  );

  if (sentences.length === 0 || words.length === 0) return 50;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Fórmula simplificada de legibilidad
  const score =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word) {
  const vowels = "aeiouAEIOU";
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) count++;
    previousWasVowel = isVowel;
  }

  return Math.max(1, count);
}

function generateSummary(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length <= 2) return text.trim();

  // Tomar las primeras 2 oraciones como resumen básico
  return sentences.slice(0, 2).join(". ").trim() + ".";
}

function generateSuggestions(text) {
  const suggestions = [];
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (words.length < 50) {
    suggestions.push("Considera expandir el contenido para mayor profundidad");
  }

  if (sentences.some((s) => s.split(/\s+/).length > 25)) {
    suggestions.push("Algunas oraciones son muy largas, considera dividirlas");
  }

  if (text.split(/[.!?]+/).length < 3) {
    suggestions.push("Agrega más párrafos para mejorar la estructura");
  }

  const avgWordsPerSentence = words.length / sentences.length;
  if (avgWordsPerSentence > 20) {
    suggestions.push("Usa oraciones más cortas para mejor legibilidad");
  }

  if (!/[.!?]$/.test(text.trim())) {
    suggestions.push("Asegúrate de terminar con puntuación adecuada");
  }

  return suggestions.length > 0
    ? suggestions
    : ["El texto está bien estructurado"];
}
