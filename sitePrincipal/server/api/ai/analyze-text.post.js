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

    // Análisis avanzado local sin APIs externas
    const analysis = await analyzeTextAdvanced(text);

    return {
      analysis,
      timestamp: new Date().toISOString(),
      provider: "advanced-local",
    };
  } catch (error) {
    console.error("Error analizando texto:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Error al analizar texto",
    });
  }
});

async function analyzeTextAdvanced(text) {
  // Análisis de sentimientos mejorado
  const sentiment = analyzeSentimentAdvanced(text);

  // Extracción de palabras clave con TF-IDF
  const keywords = extractKeywordsAdvanced(text);

  // Detección de idioma mejorada
  const language = detectLanguageAdvanced(text);

  // Puntuación de legibilidad múltiple
  const readabilityScore = calculateReadabilityAdvanced(text);

  // Resumen inteligente
  const summary = generateSummaryAdvanced(text);

  // Sugerencias contextuales
  const suggestions = generateSuggestionsAdvanced(
    text,
    sentiment,
    readabilityScore
  );

  // Métricas adicionales
  const metrics = calculateTextMetrics(text);

  return {
    sentiment: sentiment.label,
    sentimentScore: sentiment.score,
    keywords,
    summary,
    language,
    readabilityScore,
    suggestions,
    metrics,
  };
}

function analyzeSentimentAdvanced(text) {
  // Diccionarios de sentimientos más completos
  const sentimentDictionary = {
    es: {
      positive: [
        "excelente",
        "fantástico",
        "increíble",
        "maravilloso",
        "perfecto",
        "genial",
        "bueno",
        "mejor",
        "amor",
        "feliz",
        "alegría",
        "éxito",
        "ganar",
        "victoria",
        "logro",
        "beneficio",
        "ventaja",
        "eficiente",
        "efectivo",
        "útil",
        "valioso",
        "importante",
        "necesario",
        "recomendado",
        "innovador",
        "moderno",
        "avanzado",
        "profesional",
        "calidad",
        "premium",
        "superior",
        "fácil",
        "simple",
        "rápido",
        "cómodo",
        "conveniente",
        "accesible",
        "gratis",
        "económico",
      ],
      negative: [
        "terrible",
        "horrible",
        "pésimo",
        "malo",
        "peor",
        "odio",
        "triste",
        "problema",
        "error",
        "falla",
        "defecto",
        "difícil",
        "complicado",
        "imposible",
        "caro",
        "costoso",
        "lento",
        "aburrido",
        "inútil",
        "innecesario",
        "obsoleto",
        "antiguo",
        "deficiente",
        "inferior",
        "confuso",
        "frustrante",
        "molesto",
        "preocupante",
        "peligroso",
        "riesgo",
        "pérdida",
      ],
      intensifiers: [
        "muy",
        "súper",
        "extremadamente",
        "increíblemente",
        "totalmente",
        "completamente",
      ],
      negators: ["no", "nunca", "jamás", "sin", "nada", "ningún", "tampoco"],
    },
    en: {
      positive: [
        "excellent",
        "fantastic",
        "amazing",
        "wonderful",
        "perfect",
        "great",
        "good",
        "better",
        "love",
        "happy",
        "joy",
        "success",
        "win",
        "victory",
        "achievement",
        "benefit",
        "advantage",
        "efficient",
        "effective",
        "useful",
        "valuable",
        "important",
        "necessary",
        "recommended",
        "innovative",
        "modern",
        "advanced",
        "professional",
        "quality",
        "premium",
        "superior",
        "easy",
        "simple",
        "fast",
        "comfortable",
        "convenient",
        "accessible",
        "free",
        "affordable",
      ],
      negative: [
        "terrible",
        "horrible",
        "awful",
        "bad",
        "worse",
        "hate",
        "sad",
        "problem",
        "error",
        "failure",
        "defect",
        "difficult",
        "complicated",
        "impossible",
        "expensive",
        "costly",
        "slow",
        "boring",
        "useless",
        "unnecessary",
        "obsolete",
        "old",
        "deficient",
        "inferior",
        "confusing",
        "frustrating",
        "annoying",
        "worrying",
        "dangerous",
        "risk",
        "loss",
      ],
      intensifiers: [
        "very",
        "super",
        "extremely",
        "incredibly",
        "totally",
        "completely",
      ],
      negators: ["no", "not", "never", "without", "nothing", "none", "neither"],
    },
    fr: {
      positive: [
        "excellent",
        "fantastique",
        "incroyable",
        "merveilleux",
        "parfait",
        "génial",
        "bon",
        "meilleur",
        "amour",
        "heureux",
        "joie",
        "succès",
        "gagner",
        "victoire",
        "réussite",
        "bénéfice",
        "avantage",
        "efficace",
        "effectif",
        "utile",
        "précieux",
        "important",
        "nécessaire",
        "recommandé",
        "innovant",
        "moderne",
        "avancé",
        "professionnel",
        "qualité",
        "premium",
        "supérieur",
        "facile",
        "simple",
        "rapide",
        "confortable",
        "pratique",
        "accessible",
        "gratuit",
        "économique",
      ],
      negative: [
        "terrible",
        "horrible",
        "affreux",
        "mauvais",
        "pire",
        "déteste",
        "triste",
        "problème",
        "erreur",
        "échec",
        "défaut",
        "difficile",
        "compliqué",
        "impossible",
        "cher",
        "coûteux",
        "lent",
        "ennuyeux",
        "inutile",
        "inutile",
        "obsolète",
        "ancien",
        "déficient",
        "inférieur",
        "confus",
        "frustrant",
        "ennuyeux",
        "inquiétant",
        "dangereux",
        "risque",
        "perte",
      ],
      intensifiers: [
        "très",
        "super",
        "extrêmement",
        "incroyablement",
        "totalement",
        "complètement",
      ],
      negators: ["non", "ne", "jamais", "sans", "rien", "aucun", "ni"],
    },
  };

  const detectedLang = detectLanguageAdvanced(text);
  const dict = sentimentDictionary[detectedLang] || sentimentDictionary.es;

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let positiveScore = 0;
  let negativeScore = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : "";

    // Verificar intensificadores
    const hasIntensifier = dict.intensifiers.includes(prevWord);
    const multiplier = hasIntensifier ? 1.5 : 1;

    // Verificar negadores
    const hasNegator = dict.negators.some(
      (neg) => prevWord.includes(neg) || (i > 1 && words[i - 2].includes(neg))
    );

    if (dict.positive.includes(word)) {
      const score = 1 * multiplier;
      if (hasNegator) {
        negativeScore += score;
      } else {
        positiveScore += score;
      }
    } else if (dict.negative.includes(word)) {
      const score = 1 * multiplier;
      if (hasNegator) {
        positiveScore += score;
      } else {
        negativeScore += score;
      }
    }
  }

  const totalSentimentWords = positiveScore + negativeScore;
  if (totalSentimentWords === 0) {
    return { label: "neutral", score: 0, confidence: 0.5 };
  }

  const score = (positiveScore - negativeScore) / totalSentimentWords;
  const normalizedScore = Math.max(-1, Math.min(1, score));

  let label = "neutral";
  if (normalizedScore > 0.2) label = "positive";
  else if (normalizedScore < -0.2) label = "negative";

  const confidence = Math.abs(normalizedScore);

  return {
    label,
    score: normalizedScore,
    confidence,
    details: {
      positiveWords: positiveScore,
      negativeWords: negativeScore,
      totalWords: words.length,
    },
  };
}

function extractKeywordsAdvanced(text) {
  // Palabras vacías más completas
  const stopWords = {
    es: [
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
      "una",
      "como",
      "pero",
      "sus",
      "le",
      "ya",
      "o",
      "porque",
      "cuando",
      "muy",
      "sin",
      "sobre",
      "también",
      "me",
      "hasta",
      "hay",
      "donde",
      "quien",
      "desde",
      "todo",
      "nos",
      "durante",
      "todos",
      "uno",
      "les",
      "ni",
      "contra",
      "otros",
      "ese",
      "eso",
      "ante",
      "ellos",
      "e",
      "esto",
      "mí",
      "antes",
      "algunos",
      "qué",
      "unos",
      "yo",
      "otro",
      "otras",
      "otra",
      "él",
      "tanto",
      "esa",
      "estos",
      "mucho",
      "quienes",
      "nada",
      "muchos",
      "cual",
      "poco",
      "ella",
      "estar",
      "estas",
      "algunas",
      "algo",
      "nosotros",
      "mi",
      "mis",
      "tú",
      "te",
      "ti",
      "tu",
      "tus",
      "ellas",
      "nosotras",
      "vosotros",
      "vosotras",
      "os",
      "mío",
      "mía",
      "míos",
      "mías",
      "tuyo",
      "tuya",
      "tuyos",
      "tuyas",
      "suyo",
      "suya",
      "suyos",
      "suyas",
      "nuestro",
      "nuestra",
      "nuestros",
      "nuestras",
      "vuestro",
      "vuestra",
      "vuestros",
      "vuestras",
      "esos",
      "esas",
    ],
    en: [
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
      "this",
      "but",
      "his",
      "by",
      "from",
      "they",
      "we",
      "say",
      "her",
      "she",
      "or",
      "an",
      "will",
      "my",
      "one",
      "all",
      "would",
      "there",
      "their",
      "what",
      "so",
      "up",
      "out",
      "if",
      "about",
      "who",
      "get",
      "which",
      "go",
      "me",
      "when",
      "make",
      "can",
      "like",
      "time",
      "no",
      "just",
      "him",
      "know",
      "take",
      "people",
      "into",
      "year",
      "your",
      "good",
      "some",
      "could",
      "them",
      "see",
      "other",
      "than",
      "then",
      "now",
      "look",
      "only",
      "come",
      "its",
      "over",
      "think",
      "also",
      "back",
      "after",
      "use",
      "two",
      "how",
      "our",
      "work",
      "first",
      "well",
      "way",
      "even",
      "new",
      "want",
      "because",
      "any",
      "these",
      "give",
      "day",
      "most",
      "us",
      "is",
      "was",
      "are",
      "been",
      "has",
      "had",
      "were",
      "said",
      "each",
      "which",
      "their",
      "said",
      "them",
      "she",
      "many",
      "some",
      "very",
      "when",
      "much",
      "before",
      "right",
      "too",
      "means",
      "old",
      "any",
      "same",
      "tell",
      "boy",
      "follow",
      "came",
      "want",
      "show",
    ],
    fr: [
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "en",
      "une",
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "en",
      "une",
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "en",
      "une",
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "en",
      "une",
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "en",
      "une",
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
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
    ],
  };

  const detectedLang = detectLanguageAdvanced(text);
  const currentStopWords = stopWords[detectedLang] || stopWords.es;

  // Tokenización y limpieza
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !currentStopWords.includes(word) &&
        !/^\d+$/.test(word) // Excluir números puros
    );

  // Calcular frecuencia de términos (TF)
  const termFreq = {};
  words.forEach((word) => {
    termFreq[word] = (termFreq[word] || 0) + 1;
  });

  // Calcular TF-IDF simplificado (sin corpus, usando frecuencia inversa local)
  const totalWords = words.length;
  const uniqueWords = Object.keys(termFreq).length;

  const tfidf = {};
  Object.entries(termFreq).forEach(([word, freq]) => {
    const tf = freq / totalWords;
    const idf = Math.log(uniqueWords / freq); // IDF simplificado
    tfidf[word] = tf * idf;
  });

  // Ordenar por puntuación TF-IDF y tomar los top 10
  return Object.entries(tfidf)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function detectLanguageAdvanced(text) {
  const languagePatterns = {
    es: {
      words: [
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
        "por",
        "una",
        "su",
        "al",
        "del",
      ],
      patterns: [/ción\b/, /dad\b/, /mente\b/, /ñ/, /¿/, /¡/],
      weight: 0,
    },
    en: {
      words: [
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
        "not",
        "with",
        "you",
        "this",
        "but",
      ],
      patterns: [/ing\b/, /tion\b/, /ly\b/, /ed\b/, /th/, /w/],
      weight: 0,
    },
    fr: {
      words: [
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
        "ce",
        "son",
        "une",
        "sur",
        "avec",
      ],
      patterns: [/tion\b/, /ment\b/, /eur\b/, /ç/, /è/, /é/, /à/, /ù/],
      weight: 0,
    },
  };

  const words = text.toLowerCase().split(/\s+/);
  const totalWords = words.length;

  // Calcular puntuaciones para cada idioma
  Object.keys(languagePatterns).forEach((lang) => {
    const langData = languagePatterns[lang];

    // Puntuación por palabras comunes
    const wordMatches = words.filter((word) =>
      langData.words.includes(word)
    ).length;
    const wordScore = (wordMatches / totalWords) * 100;

    // Puntuación por patrones
    let patternScore = 0;
    langData.patterns.forEach((pattern) => {
      if (pattern.test(text)) {
        patternScore += 10;
      }
    });

    languagePatterns[lang].weight = wordScore + patternScore;
  });

  // Encontrar el idioma con mayor puntuación
  const detectedLang = Object.entries(languagePatterns).sort(
    ([, a], [, b]) => b.weight - a.weight
  )[0][0];

  return detectedLang;
}

function calculateReadabilityAdvanced(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllables = words.reduce(
    (total, word) => total + countSyllablesAdvanced(word),
    0
  );

  if (sentences.length === 0 || words.length === 0) return 50;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Fórmula de Flesch Reading Ease adaptada
  let fleschScore =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Ajustes adicionales
  const longWords = words.filter((word) => word.length > 6).length;
  const longWordPenalty = (longWords / words.length) * 20;

  const complexSentences = sentences.filter(
    (s) => s.split(/\s+/).length > 20
  ).length;
  const complexSentencePenalty = (complexSentences / sentences.length) * 15;

  fleschScore -= longWordPenalty + complexSentencePenalty;

  // Normalizar entre 0 y 100
  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}

function countSyllablesAdvanced(word) {
  word = word.toLowerCase();

  // Patrones de vocales por idioma
  const vowelPatterns = {
    es: /[aeiouáéíóúü]/g,
    en: /[aeiouy]/g,
    fr: /[aeiouyàáâäèéêëìíîïòóôöùúûü]/g,
  };

  const detectedLang = detectLanguageAdvanced(word);
  const vowelPattern = vowelPatterns[detectedLang] || vowelPatterns.es;

  //const vowelMatches = word.match(vowelPattern) || [];
  let syllableCount = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowelPattern.test(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }

  // Ajustes específicos por idioma
  if (detectedLang === "en") {
    // Regla del inglés: 'e' silenciosa al final
    if (word.endsWith("e") && syllableCount > 1) {
      syllableCount--;
    }
    // Diptongos comunes en inglés
    if (word.match(/[aeiou]{2}/)) {
      syllableCount--;
    }
  }

  return Math.max(1, syllableCount);
}

function generateSummaryAdvanced(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length <= 2) {
    return text.trim();
  }

  // Algoritmo de extracción de oraciones importantes
  const sentenceScores = sentences.map((sentence) => {
    const words = sentence.toLowerCase().split(/\s+/);
    let score = 0;

    // Puntuación por posición (primera y última oración tienen más peso)
    const index = sentences.indexOf(sentence);
    if (index === 0) score += 2;
    if (index === sentences.length - 1) score += 1;

    // Puntuación por longitud (oraciones de longitud media son mejores)
    const wordCount = words.length;
    if (wordCount >= 10 && wordCount <= 25) score += 2;
    else if (wordCount >= 5 && wordCount <= 35) score += 1;

    // Puntuación por palabras clave (palabras que aparecen frecuentemente)
    const allWords = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    allWords.forEach((word) => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    words.forEach((word) => {
      if (wordFreq[word] && wordFreq[word] > 1) {
        score += wordFreq[word] * 0.1;
      }
    });

    return { sentence, score, index };
  });

  // Seleccionar las mejores oraciones
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length * 0.3)))
    .sort((a, b) => a.index - b.index); // Mantener orden original

  return topSentences.map((item) => item.sentence.trim()).join(". ") + ".";
}

function generateSuggestionsAdvanced(text, sentiment, readabilityScore) {
  const suggestions = [];
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = words.length / sentences.length;

  // Sugerencias basadas en longitud
  if (words.length < 50) {
    suggestions.push(
      "Considera expandir el contenido para mayor profundidad y detalle"
    );
  } else if (words.length > 500) {
    suggestions.push(
      "El texto es muy largo, considera dividirlo en secciones más pequeñas"
    );
  }

  // Sugerencias basadas en estructura de oraciones
  if (avgWordsPerSentence > 25) {
    suggestions.push(
      "Las oraciones son muy largas, divídelas para mejorar la legibilidad"
    );
  } else if (avgWordsPerSentence < 8) {
    suggestions.push(
      "Las oraciones son muy cortas, considera combinar algunas para mejor fluidez"
    );
  }

  // Sugerencias basadas en legibilidad
  if (readabilityScore < 30) {
    suggestions.push(
      "El texto es difícil de leer, simplifica el vocabulario y acorta las oraciones"
    );
  } else if (readabilityScore < 50) {
    suggestions.push(
      "Mejora la legibilidad usando palabras más simples y oraciones más cortas"
    );
  } else if (readabilityScore > 90) {
    suggestions.push(
      "El texto podría beneficiarse de un vocabulario más variado"
    );
  }

  // Sugerencias basadas en sentimiento
  if (sentiment.label === "negative" && Math.abs(sentiment.score) > 0.5) {
    suggestions.push(
      "El tono es muy negativo, considera balancearlo con aspectos positivos"
    );
  } else if (sentiment.label === "neutral") {
    suggestions.push(
      "Agrega más emoción o personalidad al texto para hacerlo más engaging"
    );
  }

  // Sugerencias de formato
  const hasHeaders = /^#+\s/.test(text) || /^[A-Z][^.]*:/.test(text);
  if (!hasHeaders && words.length > 100) {
    suggestions.push(
      "Agrega encabezados o subtítulos para mejorar la estructura"
    );
  }

  const hasLists = /^\s*[-*•]\s/.test(text) || /^\s*\d+\.\s/.test(text);
  if (!hasLists && words.length > 150) {
    suggestions.push(
      "Considera usar listas para organizar mejor la información"
    );
  }

  // Sugerencias de puntuación
  if (!/[.!?]$/.test(text.trim())) {
    suggestions.push("Asegúrate de terminar con puntuación adecuada");
  }

  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > sentences.length * 0.3) {
    suggestions.push(
      "Reduce el uso de signos de exclamación para un tono más profesional"
    );
  }

  // Sugerencias de palabras repetidas
  const wordFreq = {};
  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
    if (cleanWord.length > 4) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });

  const repeatedWords = Object.entries(wordFreq)
    .filter(([count]) => count > 3)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    suggestions.push(
      `Evita repetir palabras como: ${repeatedWords.slice(0, 3).join(", ")}`
    );
  }

  return suggestions.length > 0
    ? suggestions
    : ["El texto está bien estructurado y es fácil de leer"];
}

function calculateTextMetrics(text) {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    characterCount: characters,
    characterCountNoSpaces: charactersNoSpaces,
    avgWordsPerSentence:
      Math.round((words.length / sentences.length) * 10) / 10,
    avgSentencesPerParagraph:
      Math.round((sentences.length / paragraphs.length) * 10) / 10,
    readingTimeMinutes: Math.ceil(words.length / 200), // Asumiendo 200 palabras por minuto
  };
}
