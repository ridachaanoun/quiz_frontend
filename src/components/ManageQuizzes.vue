<!-- ManageQuizzes.vue -->
<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">Manage Quizzes</h1>
  
      <!-- Button to Open Modal -->
      <button @click="showModal = true" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4">
        Create Quiz
      </button>
  
      <!-- Modal for Creating Quiz -->
      <Modal :isVisible="showModal" @close="showModal = false">
        <h2 class="text-xl font-semibold mb-4">Create New Quiz</h2>
        <form @submit.prevent="createQuiz" class="mb-6" enctype="multipart/form-data">
          <div class="mb-4">
            <label for="title" class="block text-gray-700">Title</label>
            <input v-model="newQuiz.title" id="title" type="text" class="w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter quiz title" required />
          </div>
          <div class="mb-4">
            <label for="category_id" class="block text-gray-700">Category</label>
            <select v-model="newQuiz.category_id" id="category_id" class="w-full border-gray-300 rounded-md shadow-sm" required>
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700">Description</label>
            <textarea v-model="newQuiz.description" id="description" class="w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter quiz description" required></textarea>
          </div>
          <div class="mb-4">
            <label for="image" class="block text-gray-700">Image</label>
            <input type="file" @change="handleFileUpload" id="image" class="w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create Quiz</button>
        </form>
      </Modal>
  
      <!-- Display Quizzes -->
      <div v-if="quizzes.length">
        <ul>
          <li v-for="quiz in quizzes" :key="quiz.id" class="mb-4">
            <div :style="{ backgroundImage: `url('http://127.0.0.1:8000/storage/${quiz.image}')` }" class="relative bg-cover bg-center w-full h-64 rounded-md overflow-hidden">
              <div class="p-4 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between">
                <div class="text-white">
                  <h2 class="text-lg font-semibold">{{ quiz.title }}</h2>
                  <p>{{ quiz.description }}</p>
                </div>
                <button @click="deleteQuiz(quiz.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>No quizzes found</div>
    </div>
  </template>
  
  <script>
  import axios from '@/plugins/axios';
  import Modal from '@/components/CreateQuizModal.vue'; // Adjust the path as necessary
  
  export default {
    components: {
      Modal
    },
    data() {
      return {
        quizzes: [],
        categories: [],
        newQuiz: {
          title: '',
          category_id: '',
          description: '',
          image: null
        },
        showModal: false, // Controls modal visibility
      };
    },
    async created() {
      await this.fetchCategories();
      await this.fetchQuizzes();
    },
    methods: {
      async fetchCategories() {
        try {
          const response = await axios.get('categories'); // Adjust the endpoint as necessary
          this.categories = response.data.categories;
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },
      async fetchQuizzes() {
        try {
          const response = await axios.get('quizzes');
          this.quizzes = response.data.quizzes;
        } catch (error) {
          console.error('Failed to fetch quizzes:', error);
        }
      },
      handleFileUpload(event) {
        this.newQuiz.image = event.target.files[0];
      },
      async createQuiz() {
        try {
          const formData = new FormData();
          formData.append('title', this.newQuiz.title);
          formData.append('category_id', this.newQuiz.category_id);
          formData.append('description', this.newQuiz.description);
          if (this.newQuiz.image) {
            formData.append('image', this.newQuiz.image);
          }
  
          const response = await axios.post('quizzes', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
  
          this.quizzes.push(response.data.quiz);
          this.newQuiz = { title: '', category_id: '', description: '', image: null };
          this.showModal = false; // Close the modal after creation
        } catch (error) {
          console.error('Failed to create quiz:', error);
        }
      },
      async deleteQuiz(id) {
        if (confirm('Do you want to delete this quiz?')) {
          try {
            await axios.delete(`quizzes/${id}`);
            this.quizzes = this.quizzes.filter(quiz => quiz.id !== id);
          } catch (error) {
            console.error('Failed to delete quiz:', error);
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Tailwind CSS styles are used here */
  </style>
  