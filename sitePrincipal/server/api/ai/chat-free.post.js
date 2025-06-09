import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  let message; // Declare message here to make it accessible in the catch block
  console.log("----1");
  try {
    const body = await readBody(event);
    message = body.message;
    //const context = body.context || "general";

    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Mensaje requerido",
      });
    }

    // Opción 1: Usar Hugging Face (GRATIS)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Gratis
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback a respuestas predefinidas
      return getFallbackResponse(message);
    }

    const data = await response.json();
    console.log("----2");
    return {
      response:
        data[0]?.generated_text || getFallbackResponse(message).response,
      timestamp: new Date().toISOString(),
      provider: "huggingface",
    };
  } catch (error) {
    console.error("Error en chat gratuito:", error);
    return getFallbackResponse(message);
  }
});

// Sistema de respuestas inteligentes sin IA
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  const responses = {
    // Saludos
    greetings: {
      keywords: [
        "hola",
        "hello",
        "hi",
        "buenos días",
        "buenas tardes",
        "buenas noches",
      ],
      responses: [
        "¡Hola! Bienvenido a nuestro sitio web. ¿En qué puedo ayudarte?",
        "¡Hola! Estoy aquí para ayudarte con información sobre nuestros servicios.",
        "¡Saludos! ¿Tienes alguna pregunta sobre nuestro sitio web?",
      ],
    },

    // Servicios
    services: {
      keywords: [
        "servicio",
        "service",
        "desarrollo",
        "web",
        "app",
        "móvil",
        "diseño",
      ],
      responses: [
        "Ofrecemos desarrollo web, aplicaciones móviles, diseño UI/UX y marketing digital. ¿Te interesa algún servicio en particular?",
        "Nuestros servicios incluyen desarrollo web moderno, apps móviles y diseño profesional. ¿Quieres más información?",
        "Somos expertos en desarrollo web con Nuxt, Vue, React y tecnologías modernas. ¿En qué proyecto estás trabajando?",
      ],
    },

    // Precios
    pricing: {
      keywords: ["precio", "cost", "cuanto", "presupuesto", "cotización"],
      responses: [
        "Los precios varían según el proyecto. Te recomiendo contactarnos para una cotización personalizada.",
        "Cada proyecto es único. ¿Te gustaría agendar una consulta gratuita para discutir tu presupuesto?",
        "Ofrecemos presupuestos personalizados. Puedes contactarnos a través del formulario de contacto.",
      ],
    },

    // Contacto
    contact: {
      keywords: ["contacto", "contact", "email", "teléfono", "llamar"],
      responses: [
        "Puedes contactarnos a través de nuestro formulario de contacto o enviarnos un email a info@mipresentacion.com",
        "Estamos disponibles de lunes a viernes de 9am a 5pm. ¿Prefieres que te contactemos por email o teléfono?",
        "Puedes encontrar toda nuestra información de contacto en la página de contacto. ¡Estaremos encantados de ayudarte!",
      ],
    },

    // Tecnologías
    tech: {
      keywords: [
        "nuxt",
        "vue",
        "react",
        "javascript",
        "typescript",
        "tecnología",
      ],
      responses: [
        "Trabajamos con tecnologías modernas como Nuxt 3, Vue 3, React, TypeScript y más. ¿Tienes alguna preferencia tecnológica?",
        "Nuestro stack incluye Nuxt, Vue, Pinia, Tailwind CSS y las últimas tecnologías web. ¿Qué tecnología te interesa?",
        "Somos expertos en el ecosistema de Vue/Nuxt y también trabajamos con React, Node.js y tecnologías full-stack.",
      ],
    },

    // Default
    default: [
      "Gracias por tu mensaje. Para obtener información más específica, te recomiendo contactar a nuestro equipo.",
      "Interesante pregunta. ¿Podrías ser más específico para poder ayudarte mejor?",
      "Estoy aquí para ayudarte con información sobre nuestros servicios. ¿Hay algo específico que te interese?",
    ],
  };

  // Buscar coincidencias
  for (const [category, data] of Object.entries(responses)) {
    if (category === "default") continue;

    const hasKeyword = data.keywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );
    if (hasKeyword) {
      const randomResponse =
        data.responses[Math.floor(Math.random() * data.responses.length)];
      return {
        response: randomResponse,
        timestamp: new Date().toISOString(),
        provider: "fallback",
        category,
      };
    }
  }
  console.log("----3");
  // Respuesta por defecto
  const defaultResponses = responses.default;
  const randomDefault =
    defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

  return {
    response: randomDefault,
    timestamp: new Date().toISOString(),
    provider: "fallback",
    category: "default",
  };
}
