<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <!-- Loading Spinner -->
    <div v-if="isSubmitting" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <i class="fas fa-circle-notch fa-spin text-5xl text-blue-500"></i>
    </div>
    
    <!-- Quiz Question Form -->
    <div v-else class="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">
        <i class="fas fa-question-circle text-blue-500 mr-2"></i> 
        {{ question.question }}
      </h2>

      <!-- Quiz Options -->
      <div v-for="(option, key) in question.options" :key="key" class="mb-4">
        <label class="flex items-center cursor-pointer">
          <input
            type="radio"
            :name="`question-${question.id}`"
            :value="key"
            v-model="selectedAnswer"
            class="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-3"
          />
          <span class="text-lg text-gray-700">{{ option }}</span>
        </label>
      </div>

      <!-- Next or Submit Button -->
      <button
        @click="nextQuestion"
        class="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center"
      >
        <i v-if="!isLastQuestion" class="fas fa-arrow-right mr-2"></i>
        <i v-else class="fas fa-check-circle mr-2"></i>
        {{ isLastQuestion ? 'Submit Quiz' : 'Next Question' }}
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
/* Additional styles are applied directly via Tailwind CSS in the template */
</style>
