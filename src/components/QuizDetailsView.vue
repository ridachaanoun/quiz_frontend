<template>
  <div class="quiz-details">
    <h1 class="text-2xl font-bold mb-4">{{ quiz.title }}</h1>
    <img :src="`http://localhost:8000/storage/${quiz.image}`" alt="Quiz Image" class="mb-4" />

    <div v-for="question in quiz.questions" :key="question.id" class="mb-4">
      <h2 class="text-lg font-semibold">{{ question.question }}</h2>
      <div v-for="(option, key) in question.options" :key="key">
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="key"
          v-model="userAnswers[question.id]"
          :id="`${question.id}-${key}`"
        />
        <label :for="`${question.id}-${key}`">{{ option }}</label>
      </div>
    </div>

    <button @click="submitAttempt" class="px-4 py-2 bg-blue-600 text-white rounded">
      Submit Quiz
    </button>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios

export default {
  name: 'QuizDetailsView',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      quiz: {
        title: '',
        image: '',
        questions: [],
      },
      userAnswers: {},
    };
  },
  computed: {
    // Assuming you have a Vuex store setup to fetch the quiz details
    currentQuiz() {
      return this.$store.getters['quizzes/currentQuiz'];
    },
  },
  watch: {
    currentQuiz(newQuiz) {
      if (newQuiz) {
        this.quiz = newQuiz;
        newQuiz.questions.forEach(question => {
          this.userAnswers[question.id] = '';
        });
      }
    },
  },
  created() {
    this.fetchQuizById(this.id);
  },
  methods: {
    fetchQuizById(id) {
      this.$store.dispatch('quizzes/fetchQuizById', id);
    },
    async submitAttempt() {
  try {
    const score = this.calculateScore();

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Send the POST request to save the attempt
    const response = await axios.post(
      `http://localhost:8000/api/quizzes/${this.id}/attempts`,
      {
        score: score,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      }
    );

    console.log('Attempt submitted successfully:', response.data);
  } catch (error) {
    console.error('Failed to submit attempt:', error);
  }
}
,
    calculateScore() {
      // Placeholder: Logic to calculate score based on user answers
      return 50; // Replace with actual score calculation logic
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
