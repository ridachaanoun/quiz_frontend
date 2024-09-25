<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <!-- Quiz Completion Message -->
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 class="text-4xl font-bold text-blue-600 mb-6">
        <i class="fas fa-trophy text-yellow-500"></i> Quiz Completed!
      </h1>
      <p class="text-2xl font-semibold text-gray-800 mb-4">
        Your score: <span class="text-blue-500">{{ formattedScore }}%</span>
      </p>

      <!-- Back to Quizzes Button -->
      <button
        @click="goBackToQuizzes"
        class="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-200 ease-in-out mt-6 flex items-center justify-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Quizzes
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizResultView',
  props: {
    score: {
      type: [Number, String],
      default: 0,
    },
  },
  computed: {
    formattedScore() {
      // Convert score to a number and handle any NaN cases
      return isNaN(Number(this.score)) ? 0 : Number(this.score);
    },
  },
  created() {
    // Log the score for debugging purposes
    console.log('Score received in QuizResultView:', this.score);
    console.log('Formatted Score:', this.formattedScore);
  },
  methods: {
    goBackToQuizzes() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
/* Additional styles applied directly via Tailwind in the template */
</style>
