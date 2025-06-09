import { defineEventHandler, readBody, createError } from "h3";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export default defineEventHandler(async (event) => {
  try {
    const { message = "general" } = await readBody(event);

    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Mensaje requerido",
      });
    }

    // Contexto del sitio web para el chatbot
    const systemPrompt = `Eres un asistente virtual inteligente para "Mi Presentación", un sitio web de presentación construido con Nuxt 3. 

Información sobre el sitio:
- Es un sitio web de presentación moderno con múltiples secciones
- Tiene funcionalidades como clima, blog, contacto, servicios
- Soporta múltiples idiomas (español, inglés, francés)
- Tiene modo oscuro/claro
- Está construido con Nuxt 3, Vue 3, y tecnologías modernas

Servicios que ofrecemos:
- Desarrollo Web (sitios web personalizados, e-commerce, CMS)
- Desarrollo de Apps Móviles (iOS, Android, multiplataforma)
- Diseño UI/UX (investigación de usuarios, prototipos, diseño visual)
- Marketing Digital (SEO, redes sociales, email marketing)

Tu trabajo es:
1. Responder preguntas sobre el sitio web y sus funcionalidades
2. Ayudar a los usuarios a navegar por el sitio
3. Proporcionar información sobre nuestros servicios
4. Ser amigable, profesional y útil
5. Responder en el idioma en que te escriban
6. Si no sabes algo específico, sé honesto pero ofrece ayuda alternativa

Mantén las respuestas concisas pero informativas.`;

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      response: text,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error en chat AI:", error);

    // Respuesta de fallback si falla la IA
    const fallbackResponses = {
      es: "Lo siento, no puedo procesar tu mensaje en este momento. ¿Puedo ayudarte con información sobre nuestros servicios o el sitio web?",
      en: "Sorry, I can't process your message right now. Can I help you with information about our services or website?",
      fr: "Désolé, je ne peux pas traiter votre message en ce moment. Puis-je vous aider avec des informations sur nos services ou le site web?",
    };

    return {
      response: fallbackResponses.es,
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
});
