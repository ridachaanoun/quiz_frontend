<template>
  <div >
    <h1 class="text-2xl font-bold mb-4 text-center " v-if="!selectedQuiz">Manage Quizzes</h1>
    
    <!-- Filter and Search Bar -->
    <div v-if="!selectedQuiz" class="flex justify-between items-center mb-4">
      <!-- Filter by Category -->
      <div class=" pr-2 flex items-center">
        <i class="fas fa-filter text-gray-500 mr-2"></i>
        <label for="categoryFilter" class="block text-gray-700">Filter by Category</label>
        <select v-model="selectedCategory" id="categoryFilter" class="w-full border-gray-300 rounded-md shadow-sm">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Search Bar -->
      <div class=" pl-2 flex items-center">
        <i class="fas fa-search text-gray-500 mr-2"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search quizzes by title..."
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>

    <!-- Button to Open Modal for Creating Quiz -->
    <button v-if="!selectedQuiz" @click="showCreateModal = true" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4">
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
          <img v-if="currentQuiz.image" :src="`http://127.0.0.1:8000/storage/${currentQuiz.image}`" alt="Current Image" class="mt-2 h-auto rounded-md" />
        </div>
        <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Update Quiz</button>
      </form>
    </Modal>

    <!-- Quiz Details -->
    <QuizDetails v-if="selectedQuiz" :id="selectedQuiz" @back="selectedQuiz = null" />

    <!-- Display Quizzes with Pagination -->
    <div v-if="paginatedQuizzes.length && !selectedQuiz" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
      <div v-for="quiz in paginatedQuizzes" :key="quiz.id" :style="{  backgroundImage: `url(${quiz.image ? `http://127.0.0.1:8000/storage/${quiz.image}` : require('../assets/download.jpeg')})`, }" class="relative bg-cover bg-center h-64 rounded-md overflow-hidden">
        <div class="p-4 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between">
          <div class="text-white" @click="selectQuiz(quiz.id)">
            <h2 class="text-lg font-semibold cursor-pointer">{{ quiz.title }}</h2>
            <p>{{ quiz.description }}</p>
          </div>
          <div>
            <button @click="editQuiz(quiz)" class="text-yellow-400 hover:text-yellow-600 mr-2"><i class="fas fa-edit"></i></button>
            <button @click="deleteQuiz(quiz.id)" class="text-red-600 hover:text-red-800"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!selectedQuiz">No quizzes found</div>

    <!-- Pagination Controls -->
    <div v-if="!selectedQuiz" class="flex justify-center mt-6">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400">
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['px-4 py-2 mx-1 rounded-md', { 'bg-indigo-600 text-white': page === currentPage, 'bg-gray-300 hover:bg-gray-400': page !== currentPage }]">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400">
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>


<script>
import { mapGetters, mapActions } from 'vuex';
import Modal from '@/components/CreateQuizModal.vue'; // Adjust the path as necessary
import QuizDetails from '@/components/QuizDetails.vue'; // Import the QuizDetails component
import axios from '@/plugins/axios';
import Swal from 'sweetalert2';

export default {
  components: {
    Modal,
    QuizDetails, // Register the QuizDetails component
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
      selectedQuiz: null, // Add selectedQuiz to track the selected quiz
      currentQuiz: null,
      searchQuery: '', // Add search query data property
      selectedCategory: '', // Track the selected category
      currentPage: 1, // Track the current page
      quizzesPerPage: 16, // Quizzes per page
    };
  },
  computed: {
    ...mapGetters('quizzes', ['quizzes']),
    categories() {
      return this.$store.getters['categories/allCategories']; // Use the getter from Vuex
    },
    filteredQuizzes() {
      if (this.selectedCategory) {
        return this.quizzes.filter(quiz => quiz.category_id === this.selectedCategory);
      }
      return this.quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedQuizzes() {
      const start = (this.currentPage - 1) * this.quizzesPerPage;
      const end = start + this.quizzesPerPage;
      return this.filteredQuizzes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredQuizzes.length / this.quizzesPerPage);
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

      await axios.post('http://localhost:8000/api/quizzes', formData, {
      });

      this.showCreateModal = false;
      await this.fetchQuizzes();

      Swal.fire({
        icon: 'success',
        title: 'Quiz Created!',
        text: 'The quiz has been successfully created.',
      });

      this.newQuiz = {
        title: '',
        category_id: '',
        description: '',
        image: null,
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to create quiz',
        text: error.response ? error.response.data.message : error.message,
      });
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

      await axios.post(`http://localhost:8000/api/quizzes/${this.currentQuiz.id}?_method=PUT`, formData, {
      });

      this.showUpdateModal = false;
      this.currentQuiz = null;
      await this.fetchQuizzes();

      Swal.fire({
        icon: 'success',
        title: 'Quiz Updated!',
        text: 'The quiz has been successfully updated.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update quiz',
        text: error.response ? error.response.data.message : error.message,
      });
    }
  },
  
  async deleteQuiz(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this quiz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/quizzes/${id}`);
        await this.fetchQuizzes();

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The quiz has been deleted.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete quiz',
          text: error.response ? error.response.data.message : error.message,
        });
      }
    }
  },

  editQuiz(quiz) {
    this.currentQuiz = { ...quiz };
    this.showUpdateModal = true;
  },
    selectQuiz(id) {
      this.selectedQuiz = id;
    },
    changePage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>
