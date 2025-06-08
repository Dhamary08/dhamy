import { ref, reactive, computed } from "vue";
import { postsService } from "~/services/posts";

export function usePosts() {
  const posts = ref([]);
  const currentPost = ref(null);
  const comments = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const pagination = reactive({
    page: 1,
    limit: 10,
    totalPosts: 0,
    totalPages: computed(() =>
      Math.ceil(pagination.totalPosts / pagination.limit)
    ),
  });

  /**
   * Carga los posts con paginación
   */
  async function fetchPosts() {
    loading.value = true;
    error.value = null;

    try {
      // Obtener posts para la página actual
      posts.value = await postsService.getPosts(
        pagination.page,
        pagination.limit
      );

      // Si es la primera carga o cambia el tamaño de página, obtener el total
      if (pagination.totalPosts === 0) {
        pagination.totalPosts = await postsService.getTotalPosts();
      }
    } catch (err) {
      error.value = "Error al cargar los posts: " + err.message;
      posts.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Cambia a una página específica
   */
  async function goToPage(page) {
    if (page < 1 || page > pagination.totalPages) return;

    pagination.page = page;
    await fetchPosts();

    // Scroll al inicio de la lista
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /**
   * Cambia el número de posts por página
   */
  async function setPageSize(size) {
    pagination.limit = size;
    pagination.page = 1; // Resetear a la primera página
    await fetchPosts();
  }

  /**
   * Carga un post específico por ID
   */
  async function fetchPost(id) {
    loading.value = true;
    error.value = null;

    try {
      currentPost.value = await postsService.getPost(id);
    } catch (err) {
      error.value = "Error al cargar el post: " + err.message;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Carga los comentarios de un post
   */
  async function fetchComments(postId) {
    loading.value = true;
    error.value = null;

    try {
      comments.value = await postsService.getPostComments(postId);
    } catch (err) {
      error.value = "Error al cargar los comentarios: " + err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    // Estado
    posts,
    currentPost,
    comments,
    loading,
    error,
    pagination,

    // Métodos
    fetchPosts,
    fetchPost,
    fetchComments,
    goToPage,
    setPageSize,
  };
}
