<template>
  <div class="post-detail-page">
    <section class="section">
      <div class="container">
        <NuxtLink to="/blog" class="back-link">← Volver al blog</NuxtLink>

        <div v-if="loading" class="loading-indicator">
          <p>Cargando post...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <template v-else-if="currentPost">
          <article class="post-content">
            <h1 class="post-title">{{ currentPost.title }}</h1>
            <p class="post-body">{{ currentPost.body }}</p>
          </article>

          <div class="comments-section">
            <h2>Comentarios</h2>

            <div v-if="loading" class="loading-indicator">
              <p>Cargando comentarios...</p>
            </div>

            <div v-else-if="comments.length === 0" class="no-comments">
              <p>No hay comentarios todavía.</p>
            </div>

            <div v-else class="comments-list">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment"
              >
                <h3 class="comment-name">{{ comment.name }}</h3>
                <p class="comment-email">{{ comment.email }}</p>
                <p class="comment-body">{{ comment.body }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePosts } from "~/composables/usePosts";
import { useSeo } from "~/composables/useSeo";

const route = useRoute();
const postId = route.params.id;

// Obtener post y comentarios
const { currentPost, comments, loading, error, fetchPost, fetchComments } =
  usePosts();

// Define a ref to hold the post data for SEO
const postForSeo = ref(null);

// Cargar post y comentarios al montar el componente
onMounted(async () => {
  await fetchPost(postId);

  if (currentPost.value) {
    postForSeo.value = currentPost.value; // Assign the post data to the ref

    // Cargar comentarios
    await fetchComments(postId);
  }
});

// Configurar SEO dinámicamente after the post is loaded
useSeo(() => {
  if (postForSeo.value) {
    return {
      title: postForSeo.value.title,
      description: postForSeo.value.body.substring(0, 160),
      url: `https://mypresentation.com/blog/${postId}`,
    };
  }
  return {}; // Return an empty object as a fallback
});
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: #0066cc;
  font-weight: 500;
}

.post-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.post-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-transform: capitalize;
}

.post-body {
  color: #444;
  line-height: 1.8;
  font-size: 1.1rem;
}

.comments-section {
  margin-top: 3rem;
}

.comments-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #0066cc;
}

.comment-name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.comment-email {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.comment-body {
  color: #444;
}

.loading-indicator,
.error-message,
.no-comments {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #e53935;
}

.no-comments {
  color: #666;
  font-style: italic;
}
</style>
