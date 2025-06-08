import type { MetaFlatSerializable } from "~/types/seoData";

const metaSeo: MetaFlatSerializable = {
  description: "A simple presentation website built with Nuxt 3",
  themeColor: [
    /*  { content: "#18181b", media: "(prefers-color-scheme: dark)" },
    { content: "white", media: "(prefers-color-scheme: light)" }, */
  ],
  twitterCreator: "@mytwitter",
  twitterSite: "@mysite",
  author: "VV",
  colorScheme: "dark light",
  applicationName: "My App",

  // Nuxt SEO Utils already sets the below tags for you
  ogSiteName: "My Presentation",
  ogLocale: "es_ES",
  ogType: "website",
  ogUrl: "https://example.com",
  ogTitle: "My Site",

  // Other Nuxt SEO modules handles these
  ogImage: "https://example.com/my-og-image.png",
  robots: "index, follow",
};

export default metaSeo;
