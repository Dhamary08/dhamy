<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <h2>My Presentation</h2>
          <p>A simple presentation website built with Nuxt 3</p>
        </div>
        <div class="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><NuxtLink to="/services">Services</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} My Presentation. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 2rem 0;
  margin-top: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-logo h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.footer-logo p {
  color: #666;
}

.footer-links h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #0066cc;
}

.footer-bottom {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
}
</style>
