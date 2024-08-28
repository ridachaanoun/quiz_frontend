<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Quizzes</h1>

    <!-- Button to Open Modal for Creating Quiz -->
    <button @click="showCreateModal = true" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4">
      Create Quiz
    </button>

    <!-- Modal for Creating Quiz -->
    <Modal :isVisible="showCreateModal" @close="showCreateModal = false">
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

    <!-- Modal for Updating Quiz -->
    <Modal :isVisible="showUpdateModal" @close="showUpdateModal = false">
      <h2 class="text-xl font-semibold mb-4">Update Quiz</h2>
      <form @submit.prevent="updateQuiz" class="mb-6" enctype="multipart/form-data">
        <div class="mb-4">
          <label for="update_title" class="block text-gray-700">Title</label>
          <input v-model="currentQuiz.title" id="update_title" type="text" class="w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter quiz title" required />
        </div>
        <div class="mb-4">
          <label for="update_category_id" class="block text-gray-700">Category</label>
          <select v-model="currentQuiz.category_id" id="update_category_id" class="w-full border-gray-300 rounded-md shadow-sm" required>
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="update_description" class="block text-gray-700">Description</label>
          <textarea v-model="currentQuiz.description" id="update_description" class="w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter quiz description" required></textarea>
        </div>
        <div class="mb-4">
          <label for="update_image" class="block text-gray-700">Image</label>
          <input type="file" @change="handleUpdateFileUpload" id="update_image" class="w-full border-gray-300 rounded-md shadow-sm" />
          <img v-if="currentQuiz.image" :src="`http://127.0.0.1:8000/storage/${currentQuiz.image}`" alt="Current Image" class="mt-2 w-full h-auto rounded-md" />
        </div>
        <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Update Quiz</button>
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
              <div>
                <button @click="editQuiz(quiz)" class="text-yellow-400 hover:text-yellow-600 mr-2">Edit</button>
                <button @click="deleteQuiz(quiz.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>No quizzes found</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Modal from '@/components/CreateQuizModal.vue'; // Adjust the path as necessary
import axios from '@/plugins/axios';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      newQuiz: {
        title: '',
        category_id: '',
        description: '',
        image: null,
      },
      showCreateModal: false,
      showUpdateModal: false,
      currentQuiz: null,
    };
  },
  computed: {
    ...mapGetters('quizzes', ['quizzes']),
    categories() {
      return this.$store.getters['categories/allCategories']; // Use the getter from Vuex
    },
  },
  async created() {
    await this.fetchQuizzes();
    await this.fetchCategories(); // Fetch categories from Vuex
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuizzes', 'fetchQuizById']),
    ...mapActions('categories', ['fetchCategories']),
    handleFileUpload(event) {
      this.newQuiz.image = event.target.files[0];
    },
    handleUpdateFileUpload(event) {
      if (event.target.files.length) {
        this.currentQuiz.image = event.target.files[0];
      }
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

        // Send the form data with Axios
        const response = await axios.post('http://localhost:8000/api/quizzes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Create response:', response.data);
        this.showCreateModal = false;
        await this.fetchQuizzes(); // Refresh quizzes after creation

        // Reset the form data
        this.newQuiz = {
          title: '',
          category_id: '',
          description: '',
          image: null
        };
      } catch (error) {
        console.error('Failed to create quiz:', error.response ? error.response.data : error.message);
      }
    },

    async updateQuiz() {
      try {
        const formData = new FormData();
        formData.append('title', this.currentQuiz.title);
        formData.append('category_id', this.currentQuiz.category_id);
        formData.append('description', this.currentQuiz.description);
        if (this.currentQuiz.image && this.currentQuiz.image instanceof File) {
          formData.append('image', this.currentQuiz.image);
        }

        // Send a PUT request with FormData
        const response = await axios.post(`http://localhost:8000/api/quizzes/${this.currentQuiz.id}?_method=PUT`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Update response:', response.data);
        this.showUpdateModal = false;
        this.currentQuiz = null;
        await this.fetchQuizzes(); // Refresh quizzes after updating
      } catch (error) {
        console.error('Failed to update quiz:', error.response ? error.response.data : error.message);
      }
    },

    async deleteQuiz(id) {
      if (confirm('Do you want to delete this quiz?')) {
        try {
          await axios.delete(`http://localhost:8000/api/quizzes/${id}`);
          await this.fetchQuizzes(); // Refresh quizzes after deletion
        } catch (error) {
          console.error('Failed to delete quiz:', error.response ? error.response.data : error.message);
        }
      }
    },

    editQuiz(quiz) {
      this.currentQuiz = { ...quiz };
      this.showUpdateModal = true;
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
