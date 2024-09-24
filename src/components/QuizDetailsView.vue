<template>
  <div class="relative flex flex-col items-center p-4 min-h-screen bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <button @click="goBack" class="btn btn-primary mb-4">Back</button>
    
    <!-- Quiz Details -->
    <div v-if="quiz" class="relative w-full max-w-lg text-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <span class="block text-lg font-medium text-gray-600">Quiz Title</span>
        <h1 class="text-3xl font-bold">{{ quiz.title }}</h1>
      </div>
      <img :src="`http://127.0.0.1:8000/storage/${quiz.image}`" alt="Quiz Image" class="mt-4 w-full max-w-md mx-auto rounded-lg shadow-lg" />
      
      <!-- Display Quiz Creator Info -->
<div v-if="quizCreatorProfile" class="mt-4 flex items-center">
  <img
    :src="`http://127.0.0.1:8000${quizCreatorProfile.profile_picture_url}`"
    alt="Profile Picture"
    class="w-12 h-12 rounded-full mr-4 cursor-pointer"
    @click="goToUserProfile(quizCreatorProfile.user.id)"
  />
  <div>
    <span class="block text-md font-medium text-gray-600">Created by:</span>
    <p class="text-lg">{{ quizCreatorProfile.user.name }}</p>
  </div>
</div>

      <div class="mt-4">
        <span class="block text-lg font-medium text-gray-600">Description</span>
        <p class="text-lg break-all">{{ quiz.description }}</p>
      </div>
      <button @click="startQuiz" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4">Start Quiz</button>
    </div>
    
    <!-- Loading Indicator -->
    <div v-else class="flex flex-col items-center justify-center w-full h-full">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
      <p class="mt-4 text-lg">Loading...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'QuizDetailsView',
  props: ['id'],
  data() {
    return {
      quiz: null,
      backgroundImage: null,
    };
  },
  computed: {
    ...mapGetters('quizzes', ['currentQuiz', 'quizCreatorProfile']),
  },
  watch: {
    id: 'fetchQuiz',
  },
  created() {
    this.fetchQuiz();
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuizById']),
    async fetchQuiz() {
      await this.fetchQuizById(this.id);
      this.quiz = this.currentQuiz;
      this.backgroundImage = `http://127.0.0.1:8000/storage/${this.quiz?.image}`;
    },
    goBack() {
      this.$router.go(-1);
    },
    startQuiz() {
      this.$router.push({ name: 'QuizQuestionView', params: { id: this.id, questionIndex: 0 } });
    },
    goToUserProfile(userId) {
    this.$router.push({ name: 'UserProfileView', params: { userId } });
  },
  },
};
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
