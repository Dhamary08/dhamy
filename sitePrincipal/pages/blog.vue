<template>
  <div class="blog-page">
    <section class="section">
      <div class="container">
        <h1 class="section-title">Blog</h1>
        <p class="blog-intro">
          Explora nuestros artículos y mantente al día con las últimas noticias
          y actualizaciones.
        </p>

        <div v-if="loading && posts.length === 0" class="loading-indicator">
          <p>Cargando posts...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <template v-else>
          <div class="posts-grid">
            <div v-for="post in posts" :key="post.id" class="post-card">
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-body">{{ post.body }}</p>
              <NuxtLink :to="`/blogs/${post.id}`" class="btn"
                >Leer más</NuxtLink
              >
            </div>
          </div>

          <!-- Mostrar paginación solo si hay posts -->
          <div v-if="posts.length > 0" class="pagination-container">
            <AppPagination
              :current-page="pagination.page"
              :total-pages="pagination.totalPages"
              :page-size="pagination.limit"
              :page-sizes="[5, 10, 15, 20, 50]"
              @page-change="goToPage"
              @page-size-change="setPageSize"
            />
          </div>

          <!-- Mostrar indicador de carga al cambiar de página -->
          <div v-if="loading && posts.length > 0" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { usePosts } from "~/composables/usePosts";
import { useSeo } from "~/composables/useSeo";
import AppPagination from "~/components/AppPagination.vue";

const route = useRoute();

// Obtener posts con paginación
const { posts, loading, error, pagination, fetchPosts, goToPage, setPageSize } =
  usePosts();

// SEO
useSeo({
  title: "Blog",
  description: "Lee nuestros últimos artículos y noticias",
  url: "https://mypresentation.com/blog",
});

// Use a ref to track if the component has mounted
const isMounted = ref(false);

// Cargar posts al montar el componente
onMounted(() => {
  isMounted.value = true; // Set to true when the component is mounted

  // Verificar si hay un parámetro de página en la URL
  const pageParam = route.query.page ? parseInt(route.query.page) : 1;
  const limitParam = route.query.limit
    ? parseInt(route.query.limit)
    : pagination.limit;

  // Establecer tamaño de página si viene en la URL
  if (limitParam !== pagination.limit) {
    pagination.limit = limitParam;
  }

  // Ir a la página especificada
  if (pageParam !== pagination.page) {
    pagination.page = pageParam;
  }

  fetchPosts();
});

// Actualizar la URL cuando cambia la página o el tamaño de página
watch(
  () => ({ page: pagination.page, limit: pagination.limit }),
  (newVal) => {
    // Solo en el cliente y después de que el componente se haya montado
    if (import.meta.client && isMounted.value) {
      const query = { ...route.query };
      query.page = newVal.page.toString();
      query.limit = newVal.limit.toString();

      // Actualizar la URL sin recargar la página
      window.history.replaceState(
        {},
        "",
        `/blog?page=${query.page}&limit=${query.limit}`
      );
    }
  },
  { deep: true }
);
</script>

<style scoped>
.blog-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  color: #666;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
  text-transform: capitalize;
}

.post-body {
  color: #666;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.loading-indicator,
.error-message {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #e53935;
}

.pagination-container {
  margin-top: 2rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
