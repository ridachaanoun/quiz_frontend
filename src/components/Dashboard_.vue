<!-- Dashboard.vue -->
<template>
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar /> 
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Dashboard_Sidebar.vue'; // Adjust the path as needed
  
  export default {
    components: {
      Sidebar,
    },
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS styles or component-specific styles can be added here */
  </style>
  