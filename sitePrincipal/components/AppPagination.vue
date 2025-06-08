<template>
  <div class="pagination">
    <div class="pagination-controls">
      <button
        @click="onPageChange(currentPage - 1)"
        class="pagination-button"
        :disabled="currentPage <= 1"
        aria-label="Página anterior"
      >
        &laquo; Anterior
      </button>

      <div class="pagination-pages">
        <!-- Primera página -->
        <button
          v-if="showFirstButton"
          @click="onPageChange(1)"
          class="pagination-page"
          :class="{ active: currentPage === 1 }"
        >
          1
        </button>

        <!-- Ellipsis izquierdo -->
        <span v-if="showLeftEllipsis" class="pagination-ellipsis">...</span>

        <!-- Páginas centrales -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="onPageChange(page)"
          class="pagination-page"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <!-- Ellipsis derecho -->
        <span v-if="showRightEllipsis" class="pagination-ellipsis">...</span>

        <!-- Última página -->
        <button
          v-if="showLastButton && totalPages > 1"
          @click="onPageChange(totalPages)"
          class="pagination-page"
          :class="{ active: currentPage === totalPages }"
        >
          {{ totalPages }}
        </button>
      </div>

      <button
        @click="onPageChange(currentPage + 1)"
        class="pagination-button"
        :disabled="currentPage >= totalPages"
        aria-label="Página siguiente"
      >
        Siguiente &raquo;
      </button>
    </div>

    <div class="pagination-info">
      <span>Página {{ currentPage }} de {{ totalPages }}</span>

      <div class="pagination-size-selector">
        <label for="page-size">Posts por página:</label>
        <select
          id="page-size"
          :value="pageSize"
          @change="onPageSizeChange($event.target.value)"
          class="page-size-select"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Array,
    default: () => [5, 10, 20, 50],
  },
});

const emit = defineEmits(["page-change", "page-size-change"]);

// Número de páginas a mostrar alrededor de la página actual
const maxVisiblePages = 3;

// Páginas visibles alrededor de la página actual
const visiblePages = computed(() => {
  const pages = [];
  let startPage = Math.max(
    2,
    props.currentPage - Math.floor(maxVisiblePages / 2)
  );
  const endPage = Math.min(
    props.totalPages - 1,
    startPage + maxVisiblePages - 1
  );

  // Ajustar si estamos cerca del final
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(2, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Mostrar botón de primera página
const showFirstButton = computed(() => {
  return props.currentPage > 2;
});

// Mostrar botón de última página
const showLastButton = computed(() => {
  return props.currentPage < props.totalPages - 1;
});

// Mostrar ellipsis izquierdo
const showLeftEllipsis = computed(() => {
  return props.currentPage > 3;
});

// Mostrar ellipsis derecho
const showRightEllipsis = computed(() => {
  return props.currentPage < props.totalPages - 2;
});

function onPageChange(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page);
  }
}

function onPageSizeChange(size) {
  emit("page-size-change", parseInt(size));
}
</script>

<style scoped>
.pagination {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e9e9e9;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-page {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-page:hover {
  background-color: #e9e9e9;
}

.pagination-page.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

.pagination-ellipsis {
  padding: 0 0.5rem;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.pagination-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

@media (max-width: 768px) {
  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .pagination-pages {
    gap: 0.25rem;
  }

  .pagination-page {
    width: 2rem;
    height: 2rem;
  }
}
</style>
