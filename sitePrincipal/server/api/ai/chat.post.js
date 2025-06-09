import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  console.log("----4");
  try {
    const { message, context = "general" } = await readBody(event);
    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Mensaje requerido",
      });
    }

    // Sistema de IA gratuito con respuestas inteligentes
    const response = await generateIntelligentResponse(message, context);

    return {
      response: response.text,
      timestamp: new Date().toISOString(),
      provider: "local-ai",
      confidence: response.confidence,
      category: response.category,
    };
  } catch (error) {
    console.error("Error en chat AI:", error);

    return {
      response:
        "Lo siento, no puedo procesar tu mensaje en este momento. ¿Puedo ayudarte con información sobre nuestros servicios o el sitio web?",
      timestamp: new Date().toISOString(),
      fallback: true,
    };
  }
});

async function generateIntelligentResponse(message) {
  console.log("----5");
  const lowerMessage = message.toLowerCase();

  // Base de conocimiento del sitio web
  const knowledgeBase = {
    // Información general del sitio
    site: {
      keywords: [
        "sitio",
        "web",
        "página",
        "website",
        "nuxt",
        "vue",
        "tecnología",
      ],
      responses: [
        "Este sitio está construido con Nuxt 3 y Vue 3, las tecnologías más modernas para desarrollo web. Incluye funcionalidades como clima, blog, múltiples idiomas y modo oscuro.",
        "Nuestro sitio web es una demostración de las capacidades modernas de desarrollo web, incluyendo SEO optimizado, diseño responsivo y funcionalidades avanzadas.",
        "Utilizamos las últimas tecnologías: Nuxt 3, Vue 3, Pinia para estado, y un sistema completo de internacionalización.",
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
        "marketing",
      ],
      responses: [
        "Ofrecemos 4 servicios principales:\n\n🌐 **Desarrollo Web**: Sitios modernos con Nuxt, Vue, React\n📱 **Apps Móviles**: iOS, Android, multiplataforma\n🎨 **Diseño UI/UX**: Experiencias centradas en el usuario\n📊 **Marketing Digital**: SEO, redes sociales, contenido\n\n¿Te interesa alguno en particular?",
        "Nuestros servicios incluyen desarrollo web completo, aplicaciones móviles nativas y multiplataforma, diseño de experiencia de usuario y estrategias de marketing digital. Cada proyecto es personalizado según tus necesidades.",
        "Somos expertos en crear soluciones digitales completas: desde sitios web modernos hasta aplicaciones móviles y estrategias de marketing. ¿En qué tipo de proyecto estás pensando?",
      ],
    },

    // Desarrollo web específico
    webDev: {
      keywords: [
        "desarrollo web",
        "sitio web",
        "website",
        "frontend",
        "backend",
        "fullstack",
      ],
      responses: [
        "En desarrollo web trabajamos con:\n\n⚡ **Frontend**: Nuxt 3, Vue 3, React, TypeScript\n🔧 **Backend**: Node.js, API REST, bases de datos\n🎨 **Styling**: Tailwind CSS, CSS moderno\n📱 **Responsive**: Diseño adaptable a todos los dispositivos\n🔍 **SEO**: Optimización para buscadores\n\n¿Qué tipo de sitio web necesitas?",
        "Creamos sitios web modernos y rápidos usando las mejores tecnologías. Desde landing pages hasta aplicaciones web complejas, siempre optimizados para rendimiento y SEO.",
        "Nuestro enfoque en desarrollo web incluye arquitectura moderna, código limpio, optimización de rendimiento y las mejores prácticas de la industria.",
      ],
    },

    // Apps móviles
    mobile: {
      keywords: ["app", "móvil", "mobile", "ios", "android", "aplicación"],
      responses: [
        "Para aplicaciones móviles ofrecemos:\n\n📱 **iOS**: Apps nativas con Swift\n🤖 **Android**: Apps nativas con Kotlin\n🔄 **Multiplataforma**: React Native, Flutter\n🔧 **Backend**: APIs y servicios en la nube\n📊 **Analytics**: Seguimiento y métricas\n\n¿Para qué plataforma necesitas tu app?",
        "Desarrollamos aplicaciones móviles tanto nativas como multiplataforma. Nos enfocamos en crear experiencias fluidas y rendimiento óptimo en cada dispositivo.",
        "Nuestras apps móviles combinan diseño atractivo con funcionalidad robusta, siempre pensando en la experiencia del usuario final.",
      ],
    },

    // Precios y presupuestos
    pricing: {
      keywords: [
        "precio",
        "cost",
        "cuanto",
        "presupuesto",
        "cotización",
        "tarifa",
      ],
      responses: [
        "Los precios varían según el proyecto:\n\n💰 **Sitio web básico**: $500 - $2,000\n🏢 **Sitio empresarial**: $2,000 - $8,000\n📱 **App móvil**: $3,000 - $15,000\n🎨 **Diseño UI/UX**: $800 - $3,000\n\nCada proyecto es único. ¿Te gustaría una cotización personalizada?",
        "Ofrecemos presupuestos transparentes y personalizados. El costo depende del alcance, funcionalidades y tiempo de desarrollo. ¿Podrías contarme más sobre tu proyecto?",
        "Nuestros precios son competitivos y justos. Incluimos consultoría inicial gratuita para entender tus necesidades y darte un presupuesto preciso.",
      ],
    },

    // Contacto
    contact: {
      keywords: [
        "contacto",
        "contact",
        "email",
        "teléfono",
        "llamar",
        "reunión",
      ],
      responses: [
        "Puedes contactarnos de varias formas:\n\n📧 **Email**: info@mipresentacion.com\n📞 **Teléfono**: +1 (123) 456-7890\n📝 **Formulario**: Usa nuestro formulario de contacto\n🕒 **Horario**: Lunes a Viernes, 9am - 5pm\n\n¿Prefieres que te contactemos nosotros?",
        "Estamos disponibles para consultas gratuitas. Puedes escribirnos por email, llamarnos o usar el formulario de contacto. Respondemos en menos de 24 horas.",
        "¡Nos encantaría conocer tu proyecto! Contáctanos y programemos una reunión para discutir tus ideas y objetivos.",
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
        "framework",
      ],
      responses: [
        "Trabajamos con tecnologías de vanguardia:\n\n⚡ **Frontend**: Nuxt 3, Vue 3, React, Svelte\n🔧 **Backend**: Node.js, Python, PHP\n💾 **Bases de datos**: PostgreSQL, MongoDB, MySQL\n☁️ **Cloud**: Vercel, AWS, Google Cloud\n🎨 **Styling**: Tailwind CSS, Sass, CSS Modules\n\n¿Tienes alguna preferencia tecnológica?",
        "Nuestro stack tecnológico está siempre actualizado con las últimas tendencias. Elegimos las herramientas adecuadas para cada proyecto específico.",
        "Somos expertos en el ecosistema JavaScript moderno, pero también trabajamos con otras tecnologías según las necesidades del proyecto.",
      ],
    },

    // Tiempo de desarrollo
    timeline: {
      keywords: ["tiempo", "cuanto tarda", "duración", "plazo", "entrega"],
      responses: [
        "Los tiempos típicos de desarrollo:\n\n⚡ **Landing page**: 1-2 semanas\n🌐 **Sitio web completo**: 4-8 semanas\n📱 **App móvil**: 8-16 semanas\n🎨 **Diseño UI/UX**: 2-4 semanas\n\nDepende de la complejidad y funcionalidades. ¿Tienes alguna fecha límite?",
        "Trabajamos con metodologías ágiles para entregar valor rápidamente. Te mantenemos informado del progreso semanalmente.",
        "El tiempo de desarrollo varía según el alcance, pero siempre cumplimos con los plazos acordados. ¿Cuál es tu timeline ideal?",
      ],
    },

    // Proceso de trabajo
    process: {
      keywords: ["proceso", "cómo trabajan", "metodología", "pasos"],
      responses: [
        "Nuestro proceso de trabajo:\n\n1️⃣ **Consulta inicial**: Entendemos tus necesidades\n2️⃣ **Propuesta**: Presupuesto y timeline detallado\n3️⃣ **Diseño**: Wireframes y prototipos\n4️⃣ **Desarrollo**: Construcción iterativa\n5️⃣ **Testing**: Pruebas exhaustivas\n6️⃣ **Lanzamiento**: Deploy y capacitación\n7️⃣ **Soporte**: Mantenimiento continuo",
        "Seguimos metodologías ágiles con entregas incrementales. Te mantenemos involucrado en cada etapa del proceso.",
        "Nuestro enfoque es colaborativo y transparente. Recibirás actualizaciones regulares y podrás ver el progreso en tiempo real.",
      ],
    },

    // Mantenimiento y soporte
    support: {
      keywords: [
        "mantenimiento",
        "soporte",
        "support",
        "actualización",
        "bugs",
      ],
      responses: [
        "Ofrecemos soporte completo:\n\n🔧 **Mantenimiento**: Actualizaciones y seguridad\n🐛 **Bug fixes**: Corrección rápida de errores\n📈 **Optimización**: Mejoras de rendimiento\n📊 **Analytics**: Reportes de uso\n🆘 **Soporte técnico**: Respuesta en 24h\n\n¿Necesitas soporte para un proyecto existente?",
        "El mantenimiento es crucial para el éxito a largo plazo. Ofrecemos planes de soporte flexibles adaptados a tus necesidades.",
        "Nuestro soporte incluye monitoreo proactivo, actualizaciones de seguridad y optimizaciones continuas.",
      ],
    },

    // Saludos
    greetings: {
      keywords: [
        "hola",
        "hello",
        "hi",
        "buenos días",
        "buenas tardes",
        "buenas noches",
        "saludos",
      ],
      responses: [
        "¡Hola! 👋 Bienvenido a nuestro sitio web. Soy tu asistente virtual y estoy aquí para ayudarte con cualquier pregunta sobre nuestros servicios de desarrollo web, apps móviles, diseño UI/UX o marketing digital. ¿En qué puedo ayudarte hoy?",
        "¡Saludos! 😊 Me alegra que estés aquí. Puedo ayudarte con información sobre nuestros servicios, precios, tecnologías o cualquier duda sobre desarrollo web y aplicaciones. ¿Qué te interesa saber?",
        "¡Hola! ✨ Estoy aquí para asistirte con todo lo relacionado a nuestros servicios digitales. Ya sea que necesites un sitio web, una app móvil o consultoría tecnológica, ¡pregúntame lo que quieras!",
      ],
    },

    // Despedidas
    farewell: {
      keywords: ["adiós", "bye", "gracias", "hasta luego", "nos vemos"],
      responses: [
        "¡Gracias por visitarnos! 😊 Si tienes más preguntas en el futuro, no dudes en contactarnos. ¡Que tengas un excelente día!",
        "¡Hasta pronto! 👋 Recuerda que estamos aquí para ayudarte con cualquier proyecto digital. ¡Esperamos trabajar contigo pronto!",
        "¡Fue un placer ayudarte! 🌟 No olvides contactarnos si decides avanzar con tu proyecto. ¡Éxito en tus emprendimientos!",
      ],
    },
  };

  // Análisis de intención más sofisticado
  let bestMatch = null;
  let highestScore = 0;

  for (const [category, data] of Object.entries(knowledgeBase)) {
    const score = calculateMatchScore(lowerMessage, data.keywords);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = { category, data };
    }
  }

  // Si encontramos una buena coincidencia
  if (bestMatch && highestScore > 0.3) {
    const responses = bestMatch.data.responses;
    const selectedResponse =
      responses[Math.floor(Math.random() * responses.length)];

    return {
      text: selectedResponse,
      confidence: highestScore,
      category: bestMatch.category,
    };
  }

  // Respuestas por defecto más inteligentes
  const defaultResponses = [
    "Interesante pregunta. Aunque no tengo información específica sobre eso, puedo ayudarte con nuestros servicios de desarrollo web, apps móviles, diseño UI/UX o marketing digital. ¿Te interesa alguno de estos temas?",
    "No estoy seguro de cómo responder a eso específicamente, pero puedo contarte sobre nuestras especialidades: creamos sitios web modernos, aplicaciones móviles y ofrecemos servicios de diseño y marketing. ¿Hay algo de esto que te interese?",
    "Esa es una pregunta que requiere más contexto. ¿Podrías ser más específico? Mientras tanto, puedo ayudarte con información sobre desarrollo web, tecnologías modernas como Nuxt y Vue, o nuestros otros servicios digitales.",
    "Me gustaría ayudarte mejor con esa consulta. ¿Podrías reformular tu pregunta? Estoy especializado en temas de desarrollo web, aplicaciones móviles, diseño UI/UX y marketing digital.",
  ];

  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    confidence: 0.2,
    category: "default",
  };
}

function calculateMatchScore(message, keywords) {
  console.log("----6");
  let score = 0;
  const messageWords = message.split(/\s+/);

  keywords.forEach((keyword) => {
    if (message.includes(keyword.toLowerCase())) {
      // Coincidencia exacta vale más
      score += 1;
    } else {
      // Buscar coincidencias parciales
      messageWords.forEach((word) => {
        if (
          word.includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(word)
        ) {
          score += 0.5;
        }
      });
    }
  });

  // Normalizar el score
  return Math.min(1, score / keywords.length);
}
