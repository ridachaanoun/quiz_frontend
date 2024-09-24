<template>
  <div class="home bg-gray-200">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
      </div>
    </div>

    <div v-if="!loading && !selectedQuiz">
      <h1 class="text-2xl font-bold mb-4 text-center mt-16  bg-gray-100">All Quizzes</h1>
      
      <!-- Filter and Search Bar -->
      <div class="flex justify-between items-center mb-4">
        <!-- Filter by Category -->
        <div class="pr-2 flex items-center">
          <i class="fas fa-filter text-gray-500 mr-2"></i>
          <label for="categoryFilter" class="block text-gray-700">Filter by Category</label>
          <select v-model="selectedCategory" id="categoryFilter" class="w-full border-gray-300 rounded-md shadow-sm">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Search Bar -->
        <div class="pl-2 flex items-center">
          <i class="fas fa-search text-gray-500 mr-2"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search quizzes by title..."
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div v-if="paginatedQuizzes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="quiz in paginatedQuizzes" :key="quiz.id" :style="{ backgroundImage: `url('http://127.0.0.1:8000/storage/${quiz.image}')` }" class="relative bg-cover bg-center h-64 rounded-md overflow-hidden">
          <div class="p-4 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between">
            <div class="text-white" @click="goToQuizDetails(quiz.id)">
              <h2 class="text-lg font-semibold cursor-pointer">{{ quiz.title }}</h2>
              <p>{{ quiz.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>No quizzes found</div>

      <!-- Pagination Controls -->
      <div class="flex justify-center mt-6">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['px-4 py-2 mx-1 rounded-md', { 'bg-indigo-600 text-white': page === currentPage, 'bg-gray-300 hover:bg-gray-400': page !== currentPage }]">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      currentPage: 1, // Track the current page
      quizzesPerPage: 16, // Quizzes per page
      searchQuery: '', // Search query data property
      selectedCategory: '', // Track the selected category
      loading: true, // Track the loading state
    };
  },
  computed: {
    ...mapGetters('auth', ['username']),
    ...mapGetters('quizzes', ['quizzes']),
    categories() {
      return this.$store.getters['categories/allCategories']; // Use the getter from Vuex
    },
    filteredQuizzes() {
      let filtered = this.quizzes;

      if (this.selectedCategory) {
        filtered = filtered.filter(quiz => quiz.category_id === this.selectedCategory);
      }

      if (this.searchQuery) {
        filtered = filtered.filter(quiz => 
          quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      return filtered;
    },
    paginatedQuizzes() {
      const start = (this.currentPage - 1) * this.quizzesPerPage;
      const end = start + this.quizzesPerPage;
      return this.filteredQuizzes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredQuizzes.length / this.quizzesPerPage);
    },
  },
  created() {
    this.fetchQuizzes();
    this.fetchCategories(); // Fetch categories from Vuex
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuizzes']),
    fetchCategories() {
      this.loading = true;
      this.$store.dispatch('categories/fetchCategories')
        .finally(() => {
          this.loading = false;
        });
    },
    goToQuizDetails(id) {
      this.$router.push({ name: 'QuizDetails', params: { id } });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    changePage(page) {
      this.currentPage = page;
    },
    fetchQuizzes() {
      this.loading = true;
      this.$store.dispatch('quizzes/fetchQuizzes')
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
/* Spinner Styles */
.spinner-border {
  border-color: transparent;
  border-top-color: #3498db;
}
</style>
