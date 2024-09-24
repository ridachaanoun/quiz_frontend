<template>
  <div class="flex flex-col md:flex-row w-full h-screen">
    <!-- Mobile Navbar (Hamburger Menu) -->
    <div class="bg-gray-800 text-white md:hidden flex items-center justify-between p-4 mt-16">
      <h2 class="text-lg font-bold">Dashboard</h2>
      <button @click="toggleSidebar" class="focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'bg-gray-800 text-white md:w-64 w-60 h-full md:block fixed',
        isSidebarOpen ? 'block' : 'hidden'
      ]"
    >
      <h2 class="text-lg font-bold mb-4 p-4">Dashboard</h2>
      <ul>
        <li>
          <button
            @click="showContent('quizzes')"
            class="block py-2 px-4 hover:bg-gray-700 rounded w-full text-left"
          >
            Manage Quizzes
          </button>
        </li>
        <li>
          <button
            @click="showContent('categories')"
            class="block py-2 px-4 hover:bg-gray-700 rounded w-full text-left"
          >
            Manage Categories
          </button>
        </li>
        <li>
          <button
            @click="showContent('users')"
            class="block py-2 px-4 hover:bg-gray-700 rounded w-full text-left"
          >
            Manage Users
          </button>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="p-6 flex-1  md:ml-64 mt-16">
      <div  v-if="currentContent === 'categories'">
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
import ManageCategories from "@/components/ManageCategories.vue";
import ManageQuizzes from "@/components/ManageQuizzes.vue";
import ManageUsers from "@/components/ManageUsers.vue";

export default {
  components: {
    ManageCategories,
    ManageQuizzes,
    ManageUsers,
  },
  data() {
    return {
      currentContent: "quizzes", // Default to ManageQuizzes
      isSidebarOpen: false, // Sidebar visibility state for mobile view
    };
  },
  methods: {
    showContent(content) {
      this.currentContent = content;
      if (window.innerWidth < 768) {
        // Close the sidebar when a menu item is clicked on mobile
        this.isSidebarOpen = false;
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
