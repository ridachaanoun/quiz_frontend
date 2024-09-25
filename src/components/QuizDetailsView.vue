<template>
  <div
    class="relative flex flex-col items-center p-4 min-h-screen bg-cover bg-center"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- Back Button -->
    <button @click="goBack" class="btn btn-primary mb-4">
      <i class="fas fa-arrow-left mr-2"></i> Back
    </button>

    <!-- Quiz Details -->
    <div
      v-if="quiz"
      class="relative w-full max-w-lg text-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg"
    >
      <!-- Quiz Title -->
      <div class="mb-4">
        <span class="block text-lg font-semibold text-gray-700">Quiz Title</span>
        <h1 class="text-3xl font-extrabold text-gray-800">{{ quiz.title }}</h1>
      </div>

      <!-- Quiz Image -->
      <img
        :src="`http://127.0.0.1:8000/storage/${quiz.image}`"
        alt="Quiz Image"
        class="mt-4 w-full max-w-md mx-auto rounded-lg shadow-lg"
      />

      <!-- Quiz Creator Info -->
      <div v-if="quizCreatorProfile" class="mt-4 flex items-center justify-center">
        <img
          :src="`http://127.0.0.1:8000${quizCreatorProfile.profile_picture_url}`"
          alt="Profile Picture"
          class="w-12 h-12 rounded-full mr-4 cursor-pointer"
          @click="goToUserProfile(quizCreatorProfile.user.id)"
        />
        <div class="text-left">
          <span class="block text-md font-medium text-gray-600">Created by:</span>
          <p class="text-lg font-semibold">{{ quizCreatorProfile.user.name }}</p>
        </div>
      </div>

      <!-- Quiz Description -->
      <div class="mt-6">
        <span class="block text-lg font-medium text-gray-700">Description</span>
        <p class="text-lg text-gray-800 break-all">{{ quiz.description }}</p>
      </div>

      <!-- Start Quiz Button -->
      <button
        @click="startQuiz"
        class="mt-6 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 shadow-md transition duration-200 ease-in-out"
      >
        <i class="fas fa-play mr-2"></i> Start Quiz
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-else class="flex flex-col items-center justify-center w-full h-screen ">
      <i class="fas fa-circle-notch fa-spin text-4xl text-blue-600"></i>
      <p class="mt-4 text-lg font-semibold text-gray-700">Loading Quiz...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "QuizDetailsView",
  props: ["id"],
  data() {
    return {
      quiz: null,
      backgroundImage: null,
    };
  },
  computed: {
    ...mapGetters("quizzes", ["currentQuiz", "quizCreatorProfile"]),
  },
  watch: {
    id: "fetchQuiz",
  },
  created() {
    this.fetchQuiz();
  },
  methods: {
    ...mapActions("quizzes", ["fetchQuizById"]),
    async fetchQuiz() {
      await this.fetchQuizById(this.id);
      this.quiz = this.currentQuiz;
      this.backgroundImage = `http://127.0.0.1:8000/storage/${this.quiz?.image}`;
    },
    goBack() {
      this.$router.go(-1);
    },
    startQuiz() {
      this.$router.push({
        name: "QuizQuestionView",
        params: { id: this.id, questionIndex: 0 },
      });
    },
    goToUserProfile(userId) {
      this.$router.push({ name: "UserProfileView", params: { userId } });
    },
  },
};
</script>

<style scoped>
/* Customize styles for better visuals */
.bg-cover {
  background-size: cover;
  background-position: center;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
}

.btn-primary {
  background-color: #3490dc;
  color: #fff;
}

.btn-primary:hover {
  background-color: #2779bd;
}
</style>
