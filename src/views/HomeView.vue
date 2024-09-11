<template>
  <div class="home">
    <p>{{ username }}</p>
    <div v-if="!selectedQuiz">
      <h1 class="text-2xl font-bold mb-4 text-center">All Quizzes</h1>

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
// import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  data() {
    return {
      currentPage: 1, // Track the current page
      quizzesPerPage: 8, // Quizzes per page
    };
  },
  computed: {
    ...mapGetters('auth', ['username']),
    ...mapGetters('quizzes', ['quizzes']),
    paginatedQuizzes() {
      const start = (this.currentPage - 1) * this.quizzesPerPage;
      const end = start + this.quizzesPerPage;
      return this.quizzes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.quizzes.length / this.quizzesPerPage);
    },
  },
  created() {
    this.fetchQuizzes();
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuizzes']),
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
  },
};
</script>
