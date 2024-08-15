<!-- Dashboard.vue -->
<template>
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-1/4 bg-gray-800 text-white min-h-screen p-4">
        <h2 class="text-lg font-bold mb-4">Dashboard</h2>
        <ul>
          <li>
            <button @click="showContent('categories')" class="block py-2 px-4 hover:bg-gray-700 rounded">
              Manage Categories
            </button>
          </li>
          <li>
            <button @click="showContent('quizzes')" class="block py-2 px-4 hover:bg-gray-700 rounded">
              Manage Quizzes
            </button>
          </li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="w-3/4 p-6">
        <div v-if="currentContent === 'categories'">
          <ManageCategories />
        </div>
        <div v-if="currentContent === 'quizzes'">
          <ManageQuizzes />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ManageCategories from '@/components/ManageCategories.vue';
  import ManageQuizzes from '@/components/ManageQuizzes.vue';
  
  export default {
    components: {
      ManageCategories,
      ManageQuizzes
    },
    data() {
      return {
        currentContent: 'categories' // Default to ManageCategories
      };
    },
    methods: {
      showContent(content) {
        this.currentContent = content;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS styles or component-specific styles can be added here */
  </style>
  