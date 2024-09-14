<template>
  <div class="quiz-result">
    <h1 class="text-3xl font-bold">Quiz Completed!</h1>
    <p class="text-xl mt-4">Your score: {{ formattedScore }}%</p>
    <button @click="goBackToQuizzes" class="btn btn-primary mt-4">Back to Quizzes</button>
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
/* Add styles for QuizResultView */
</style>
