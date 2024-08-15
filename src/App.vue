<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
      <router-link v-if="isAdmin" to="/Dashboard">Dashboard</router-link>  |
      <span v-if="isAuthenticated">Welcome, {{ username }}!</span>
      <button v-if="isAuthenticated" @click="logout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin', 'username']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
  created() {
    // Fetch user data when the component is created
    this.$store.dispatch('auth/fetchUserData').catch(() => {
      // Handle errors or redirect if needed
    });
  },
};
</script>

<style>
/* Add global styles if needed */
</style>
