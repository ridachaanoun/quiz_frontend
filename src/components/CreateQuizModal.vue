<!-- Modal.vue -->
<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <slot></slot>
        <button @click="close" class="mt-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Modal specific styles can be added here */
  </style>
  