import metaSeo from "./plugins/metaSeo";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@nuxtjs/seo",
  ],
  site: {
    url: "https://nuxtseo.com",
    name: "My Presentation",
    titleTemplate: "%s | My Presentation",
    description: "A simple presentation website built with Nuxt 3",
    lang: "es",
    locale: "es_ES",
  },
  seo: {
    meta: metaSeo,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  $development: {
    app: {
      head: {
        title: "My Presentation - Development Mode",
        meta: [
          {
            name: "description",
            content: "Development mode for My Presentation",
          },
          { name: "robots", content: "noindex, nofollow" },
        ],
      },
    },
  },
  $production: {
    app: {
      head: {
        title: "My Presentation",
        meta: [
          {
            name: "description",
            content: "A simple presentation website built with Nuxt 3",
          },
          { name: "robots", content: "index, follow" },
        ],
      },
    },
  },
});
