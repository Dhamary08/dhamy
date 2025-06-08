<template>
  <div class="contact-page">
    <section class="section">
      <div class="container">
        <h1 class="section-title">Contact Us</h1>
        <p class="contact-intro">
          Have questions or want to discuss a project? Fill out the form below
          and we'll get back to you as soon as possible.
        </p>

        <div class="contact-container">
          <div class="contact-form-container">
            <form class="contact-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="Your name"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  placeholder="Your email address"
                />
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  v-model="form.subject"
                  required
                  placeholder="Subject of your message"
                />
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  placeholder="Your message"
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" class="btn" :disabled="isSubmitting">
                {{ isSubmitting ? "Sending..." : "Send Message" }}
              </button>

              <div v-if="formStatus" :class="['form-status', formStatus.type]">
                {{ formStatus.message }}
              </div>
            </form>
          </div>

          <div class="contact-info">
            <h3>Contact Information</h3>
            <div class="info-item">
              <strong>Address:</strong>
              <p>123 Business Street, Suite 100<br />City, State 12345</p>
            </div>
            <div class="info-item">
              <strong>Email:</strong>
              <p>info@mypresentation.com</p>
            </div>
            <div class="info-item">
              <strong>Phone:</strong>
              <p>+1 (123) 456-7890</p>
            </div>
            <div class="info-item">
              <strong>Business Hours:</strong>
              <p>Monday - Friday: 9am - 5pm<br />Saturday & Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useHead } from "@vueuse/head";

useHead({
  title: "Contact Us",
  meta: [
    {
      name: "description",
      content:
        "Get in touch with our team for inquiries or project discussions",
    },
  ],
});

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const formStatus = ref(null);

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reset form
    form.name = "";
    form.email = "";
    form.subject = "";
    form.message = "";

    formStatus.value = {
      type: "success",
      message:
        "Your message has been sent successfully! We will get back to you soon.",
    };

    // Clear success message after 5 seconds
    setTimeout(() => {
      formStatus.value = null;
    }, 5000);
  } catch (error) {
    formStatus.value = {
      type: "error",
      message: "There was an error sending your message. Please try again.",
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  color: #666;
}

.contact-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.contact-form-container {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.form-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
}

.form-status.success {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.form-status.error {
  background-color: #ffebee;
  color: #c62828;
}

.contact-info {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 2rem;
}

.contact-info h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.info-item p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>
