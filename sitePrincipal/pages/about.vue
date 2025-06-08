<template>
  <div class="about-page">
    <section class="section">
      <div class="container">
        <h1 class="section-title">About Us</h1>
        <div class="about-content">
          <div class="about-text">
            <p>
              Welcome to our presentation website. We are a team of passionate
              individuals dedicated to creating amazing experiences for our
              clients.
            </p>
            <p>
              Our mission is to deliver high-quality solutions that meet the
              unique needs of each client. With years of experience in the
              industry, we have developed a deep understanding of what it takes
              to create successful projects.
            </p>
            <p>
              We believe in the power of innovation and continuous improvement.
              That's why we stay up-to-date with the latest technologies and
              best practices in our field.
            </p>
          </div>
          <div class="about-image">
            <img src="/placeholder.svg?height=400&width=600" alt="About Us" />
          </div>
        </div>
      </div>
    </section>

    <section class="team-section section">
      <div class="container">
        <h2 class="section-title">Our Team</h2>
        <div class="team-grid">
          <div class="team-member" v-for="(member, index) in team" :key="index">
            <div class="member-image">
              <img
                :src="`/placeholder.svg?height=300&width=300&text=Team+Member+${
                  index + 1
                }`"
                :alt="member.name"
              />
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-position">{{ member.position }}</p>
            <p class="member-bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useHead } from "@vueuse/head";

useHead({
  title: "About Us",
  meta: [
    {
      name: "description",
      content: "Learn more about our team and our mission",
    },
  ],
});

const team = [
  {
    name: "John Doe",
    position: "CEO & Founder",
    bio: "John has over 15 years of experience in the industry and leads our company vision.",
  },
  {
    name: "Jane Smith",
    position: "Creative Director",
    bio: "Jane brings creative solutions to complex problems with her innovative approach.",
  },
  {
    name: "Mike Johnson",
    position: "Technical Lead",
    bio: "Mike ensures that our technical implementations are robust and scalable.",
  },
  {
    name: "Sarah Williams",
    position: "Marketing Specialist",
    bio: "Sarah helps our clients reach their target audience with effective strategies.",
  },
];
</script>

<style scoped>
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.about-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.team-member {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-image img {
  width: 100%;
  height: auto;
}

.member-name {
  font-size: 1.5rem;
  margin: 1rem 1rem 0.5rem;
}

.member-position {
  color: #0066cc;
  font-weight: 600;
  margin: 0 1rem 0.5rem;
}

.member-bio {
  color: #666;
  margin: 0 1rem 1rem;
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
  }

  .about-image {
    order: -1;
    margin-bottom: 1rem;
  }
}
</style>
