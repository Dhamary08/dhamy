import { fetchApi } from "./api";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const postsService = {
  /**
   * Obtiene todos los posts con paginación
   * @param {number} page - Número de página (comienza en 1)
   * @param {number} limit - Cantidad de posts por página
   */
  async getPosts(page = 1, limit = 10) {
    return await fetchApi(`${BASE_URL}/posts?_page=${page}&_limit=${limit}`);
  },

  /**
   * Obtiene el total de posts disponibles
   */
  async getTotalPosts() {
    const response = await fetch(`${BASE_URL}/posts`);
    // JSONPlaceholder proporciona el total en el header x-total-count
    const total = response.headers.get("x-total-count") || "100";
    return Number.parseInt(total);
  },

  /**
   * Obtiene un post específico por ID
   */
  async getPost(id) {
    return await fetchApi(`${BASE_URL}/posts/${id}`);
  },

  /**
   * Obtiene los comentarios de un post
   */
  async getPostComments(postId) {
    return await fetchApi(`${BASE_URL}/posts/${postId}/comments`);
  },
};
