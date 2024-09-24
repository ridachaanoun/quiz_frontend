<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- Login Form -->
    <div class="w-full lg:w-1/3 max-w-md p-6 bg-white rounded-3xl shadow-lg">
      <h1 class="text-3xl font-semibold text-center mb-4">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex flex-col">
          <label for="email" class="text-base font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 bg-transparent"
            placeholder="Enter your email"
            required
          />
          <span v-if="errors.email" class="text-red-600 text-sm">{{ errors.email }}</span>
        </div>
        <div class="flex flex-col">
          <label for="password" class="text-base font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 bg-transparent"
            placeholder="Enter your password"
            required
          />
          <span v-if="errors.password" class="text-red-600 text-sm">{{ errors.password }}</span>
        </div>
        <div v-if="errors.general" class="text-red-600 text-center text-sm">{{ errors.general }}</div>

        <!-- Loading Spinner or Message -->


        <div class="mt-6">
          <button
            type="submit"
            class="w-full py-2 spinner-border  bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition ease-in-out duration-150"
            :disabled="loading"  
          >
            <span v-if="loading" class="">checking</span>
            <span v-else>Login</span>
          </button>
        </div>
        <div class="mt-4 text-center">
          <p class="text-base">Don't have an account? <router-link to="/register" class="text-indigo-600">Register here</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false, // Add loading state
      errors: {} // Store validation errors
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      // Clear previous error messages
      this.errors = {};
      this.loading = true; // Start loading

      try {
        await this.login({ email: this.email, password: this.password });
        this.$router.push('/'); // Redirect to home page after successful login
      } catch (error) {
        // Handle validation or other errors
        this.errors.general = 'email or password is wrong. Please try again.';
      } finally {
        this.loading = false; // Stop loading
      }
    }
  }
};
</script>

<style scoped>
/* Add your component-specific styles here, if needed */
</style>
