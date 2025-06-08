<template>
  <div class="services-page">
    <section class="section">
      <div class="container">
        <h1 class="section-title">Our Services</h1>
        <p class="services-intro">
          We offer a wide range of services to help your business succeed in the
          digital world. Our team of experts is ready to assist you with your
          specific needs.
        </p>

        <div class="services-grid">
          <div
            class="service-card"
            v-for="(service, index) in services"
            :key="index"
          >
            <div class="service-icon">{{ service.icon }}</div>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="(feature, i) in service.features" :key="i">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to get started?</h2>
          <p>Contact us today to discuss your project requirements.</p>
          <NuxtLink to="/contact" class="btn">Contact Us</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useHead } from "@vueuse/head";

useHead({
  title: "Our Services",
  meta: [
    {
      name: "description",
      content:
        "Explore the range of services we offer to help your business grow",
    },
  ],
});

const services = [
  {
    icon: "💻",
    title: "Web Development",
    description:
      "We create modern, responsive websites that look great on all devices.",
    features: [
      "Custom website design",
      "E-commerce solutions",
      "Content management systems",
      "Website maintenance",
    ],
  },
  {
    icon: "📱",
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android.",
    features: [
      "iOS app development",
      "Android app development",
      "Cross-platform solutions",
      "App maintenance and updates",
    ],
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    description:
      "User-centered design that enhances user experience and engagement.",
    features: [
      "User research",
      "Wireframing and prototyping",
      "Visual design",
      "Usability testing",
    ],
  },
  {
    icon: "📊",
    title: "Digital Marketing",
    description: "Strategic marketing solutions to grow your online presence.",
    features: [
      "Search engine optimization (SEO)",
      "Social media marketing",
      "Content marketing",
      "Email marketing campaigns",
    ],
  },
];
</script>

<style scoped>
.services-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  color: #666;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.service-description {
  color: #666;
  margin-bottom: 1.5rem;
}

.service-features {
  list-style-position: inside;
  color: #555;
}

.service-features li {
  margin-bottom: 0.5rem;
}

.cta-section {
  background-color: #f0f8ff;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta-content p {
  margin-bottom: 2rem;
  color: #666;
}
</style>
