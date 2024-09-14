<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div v-if="isSubmitting" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
    </div>
    <div v-else class="w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">{{ question.question }}</h2>
      <div v-for="(option, key) in question.options" :key="key" class="mb-2 flex items-center">
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="key"
          v-model="selectedAnswer"
          class="mr-2"
        />
        <label class="text-lg">{{ option }}</label>
      </div>
      <button
        @click="nextQuestion"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        {{ isLastQuestion ? 'Submit' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from '@/plugins/axios';

export default {
  name: 'QuizQuestionView',
  props: ['id', 'questionIndex'],
  data() {
    return {
      selectedAnswer: null,
      isSubmitting: false,  // Prevent multiple submissions
    };
  },
  computed: {
    ...mapGetters('quizzes', ['quizQuestions']),
    question() {
      return this.quizQuestions[this.questionIndex];
    },
    isLastQuestion() {
      return this.questionIndex == this.quizQuestions.length - 1;
    },
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuizById']),
    async nextQuestion() {
      this.$store.dispatch('quizzes/saveAnswer', { questionId: this.question.id, answer: this.selectedAnswer });

      if (this.isLastQuestion) {
        await this.submitQuiz();  // Wait for submission to complete
      } else {
        this.$router.push({
          name: 'QuizQuestionView',
          params: { id: this.id, questionIndex: Number(this.questionIndex) + 1 },
        });
      }
    },
    async submitQuiz() {
      if (this.isSubmitting) return;  // Prevent multiple submissions

      this.isSubmitting = true;

      try {
        const correctAnswers = this.quizQuestions.reduce((score, question) => {
          const userAnswer = this.$store.getters['quizzes/userAnswers'][question.id];
          return score + (userAnswer === question.correct_option ? 1 : 0);
        }, 0);

        const score = Math.floor((correctAnswers / this.quizQuestions.length) * 100);

        // Post the score to the server
        const response = await axios.post(`http://localhost:8000/api/quizzes/${this.id}/attempts`, {
          score: score,
        });
        console.log('Quiz result saved:', response.data);

        // Navigate to the results view
        this.$router.push({ name: 'QuizResultView', query: { score } });

      } catch (error) {
        console.error('Failed to save quiz result:', error);
      } finally {
        this.isSubmitting = false;  // Reset state after submission
      }
    },
  },
  created() {
    if (!this.quizQuestions.length) {
      this.fetchQuizById(this.id);
    }
  },
};
</script>

<style scoped>
/* Tailwind CSS classes are used directly in the template for styling */
</style>
