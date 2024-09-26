<template>
    <div class="quiz-details">
      <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ quiz.title }}</h1>
      <img
        :src="`http://127.0.0.1:8000/storage/${quiz.image}`"
        alt="Quiz Image"
        class="w-full h-auto rounded-lg shadow-lg mb-4"
      />
      
      <label class="block text-gray-600 font-semibold mb-1">Description:</label>
      <p class="text-gray-700 mb-2 break-all">{{ quiz.description }}</p>
      <p class="text-gray-600"><strong>Category:</strong> {{ quiz.category.name }}</p>
  
      <!-- Questions Section -->
      <div v-if="quiz.questions && quiz.questions.length" class="mt-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Questions</h2>
        <ul class="list-disc pl-5">
          <li v-for="question in quiz.questions" :key="question.id">{{ question.text }}</li>
        </ul>
      </div>
  
      <button @click="goBack" class="mt-4 bg-gray-300 rounded px-4 py-2">Back to Quizzes</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      quiz: {
        type: Object,
        required: true,
      },
    },
    methods: {
      goBack() {
        this.$emit('go-back'); // Emit an event to notify the parent component to go back
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles for quiz details here */
  </style>
  