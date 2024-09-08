<!-- Dashboard.vue -->
<template>
    <div class="flex w-full">
      <!-- Sidebar -->
      <div class="bg-gray-800 text-white w-min h-dvh">
        <h2 class="text-lg font-bold mb-4">Dashboard</h2>
        <ul>
          <li>
            <button @click="showContent('quizzes')" class="block py-2 px-4 hover:bg-gray-700 rounded">
              Manage Quizzes
            </button>
          </li>
          <li>
            <button @click="showContent('categories')" class="block py-2 px-4 hover:bg-gray-700 rounded">
              Manage Categories
            </button>
          </li>
          <li>
          <button @click="showContent('users')" class="block py-2 px-4 hover:bg-gray-700 rounded">
            Manage Users
          </button>
        </li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="p-6 w-full">
        <div v-if="currentContent === 'categories'">
          <ManageCategories />
        </div>
        <div v-if="currentContent === 'quizzes'">
          <ManageQuizzes />
        </div>
        <div v-if="currentContent === 'users'">
        <ManageUsers />
      </div>
      </div>
    </div>
  </template>
  
  <script>
  import ManageCategories from '@/components/ManageCategories.vue';
  import ManageQuizzes from '@/components/ManageQuizzes.vue';
  import ManageUsers from '@/components/ManageUsers.vue';
  export default {
    components: {
      ManageCategories,
      ManageQuizzes,
      ManageUsers
    },
    data() {
      return {
        currentContent: 'quizzes' // Default to ManageCategories
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
  