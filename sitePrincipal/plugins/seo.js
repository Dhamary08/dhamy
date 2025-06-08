import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  // Default SEO values
  const defaultSeo = {
    title: "My Presentation",
    description: "A simple presentation website built with Nuxt 3",
    image: "/social-image.jpg",
    url: "https://mypresentation.com",
  };

  // Make default SEO values available in the app
  nuxtApp.provide("defaultSeo", defaultSeo);
});
