<template>
  <div class="attempts container mx-auto py-8">
    <h2 class="text-3xl font-bold text-center mb-8">User Attempts</h2>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center">
      <div class="spinner border-4 border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      <span class="ml-4 text-blue-500">Loading attempts...</span>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- Attempts Display -->
    <div v-if="attempts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="attempt in paginatedAttempts"
        :key="attempt.id"
        class="attempt-card bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div
          class="attempt-background bg-cover bg-center h-48"
          :style="{ backgroundImage: 'url(' + getImageUrl(attempt.quiz.image) + ')' }"
        ></div>
        <div class="p-4">
          <h3 class="text-xl font-semibold">{{ attempt.quiz.title }}</h3>
          <p class="text-gray-700"><strong>Score:</strong> {{ attempt.score }}</p>
          <p class="text-gray-500"><strong>Date:</strong> {{ formatDate(attempt.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-8 space-x-4" v-if="totalPages > 1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span class="text-lg">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      attempts: [],
      loading: true,
      error: null,
      currentPage: 1,
      perPage: 20,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.attempts.length / this.perPage);
    },
    paginatedAttempts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.attempts.slice(start, end);
    },
  },
  methods: {
    fetchAttempts() {
      this.loading = true;
      axios
        .get("http://localhost:8000/api/attempts")
        .then((response) => {
          if (response.data.success) {
            this.attempts = response.data.attempts;
          } else {
            this.error = "Failed to fetch attempts.";
          }
        })
        .catch(() => {
          this.error = "An error occurred while fetching attempts.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    getImageUrl(imagePath) {
      return `http://localhost:8000/storage/${imagePath}`;
    },
    changePage(page) {
      window.scrollTo({top: 0,behavior: 'smooth' // Optional for a smooth scrolling effect
    });
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchAttempts();
  },
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3490dc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
