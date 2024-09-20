<template>
  <div>
    <nav v-if="isAuthenticated" class="bg-sky-600 p-4 flex items-center justify-between flex-wrap">
      <!-- Brand / Home Link -->
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <router-link class="font-semibold text-xl tracking-tight" to="/">
          Home
        </router-link>
      </div>

      <!-- Hamburger Icon -->
      <div class="block lg:hidden">
        <button @click="isMenuOpen = !isMenuOpen"
          class="flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <!-- Links -->
      <div :class="{
        'w-full block flex-grow lg:flex lg:items-center lg:w-auto': true,
        hidden: !isMenuOpen && isSmallScreen,
      }">
        <div class="text-sm lg:flex-grow">
          <router-link v-if="isAdmin" class="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
            to="/dashboard">Dashboard</router-link>
          <router-link v-if="isAuthenticated" class="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4"
            :to="`/profile`">Profile</router-link>
        </div>
        <div class="text-sm">
          <span v-if="isAuthenticated" class="block mt-4 lg:inline-block lg:mt-0 text-gray-200 mr-4">
            Welcome, {{ username }}!
          </span>
          <button v-if="isAuthenticated"
            class="block mt-4 lg:inline-block lg:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "isAdmin", "username"]),
    isSmallScreen() {
      return window.innerWidth < 1024; // Detect if the screen is smaller than the lg breakpoint
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    handleResize() {
      if (!this.isSmallScreen) {
        this.isMenuOpen = false;
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
/* Tailwind styles are enough */
</style>
