<template>
  <div class="mx-auto p-4 mt-16">
    <h1 class="text-2xl font-bold mb-4">My Quizzes</h1>

    <!-- Create Quiz Button -->
    <button @click="openCreateModal" class="mb-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">
      Create Quiz
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>

    <!-- Quiz Details Component -->
    <QuizDetailView v-if="selectedQuiz" :quiz="selectedQuiz" @go-back="resetView" />

    <!-- Quiz List View -->
    <div v-else>
      <div v-if="quizzes.length === 0" class="text-center">No quizzes found.</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="quiz in paginatedQuizzes" 
          :key="quiz.id" 
          class="border rounded-lg p-4 shadow h-56 cursor-pointer" 
          @click="selectQuiz(quiz)"
          :style="{ 
            backgroundImage: `url(${quiz.image ? `http://127.0.0.1:8000/storage/${quiz.image}` : require('../assets/download.jpeg')})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }"
        >
          <div class="bg-black bg-opacity-50 p-4 rounded">
            <router-link :to="`/userquiz/${quiz.id}`" class="text-blue-600">
            {{ quiz.title }}
          </router-link>
            <p class="text-sm text-gray-200 break-all h-10 overflow-hidden">{{ quiz.description }}</p>
            <p class="text-xs text-gray-300">Category: {{ quiz.category.name }}</p>
            <!-- Update and Delete Buttons -->
            <button @click.stop="openUpdateModal(quiz)" class="mt-2 bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600 transition">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click.stop="deleteQuiz(quiz.id)" class="mt-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded-l-md hover:bg-gray-400">
          Previous
        </button>
        <span class="px-4 py-2 bg-white border border-gray-300">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded-r-md hover:bg-gray-400">
          Next
        </button>
      </div>
    </div>

    <!-- Create Quiz Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 class="text-lg font-semibold mb-4">Create New Quiz</h2>
        <form @submit.prevent="createQuiz">
          <!-- Form Inputs for Quiz Creation -->
          <div class="mb-4">
            <label class="block mb-1 font-medium">Title:</label>
            <input v-model="newQuiz.title" type="text" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Description:</label>
            <textarea v-model="newQuiz.description" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Category:</label>
            <select v-model="newQuiz.category_id" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Image:</label>
            <input type="file" @change="onFileChange" class="border rounded w-full px-3 py-2" />
          </div>
          <div class="flex justify-between">
            <button type="button" @click="closeCreateModal" class="bg-gray-300 rounded px-4 py-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Create Quiz</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Quiz Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 class="text-lg font-semibold mb-4">Update Quiz</h2>
        <form @submit.prevent="updateQuiz">
          <!-- Form Inputs for Quiz Update -->
          <div class="mb-4">
            <label class="block mb-1 font-medium">Title:</label>
            <input v-model="currentQuiz.title" type="text" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Description:</label>
            <textarea v-model="currentQuiz.description" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Category:</label>
            <select v-model="currentQuiz.category_id" class="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="" disabled>Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Image:</label>
            <input type="file" @change="onFileChangeUpdate" class="border rounded w-full px-3 py-2" />
          </div>
          <div class="flex justify-between">
            <button type="button" @click="closeUpdateModal" class="bg-gray-300 rounded px-4 py-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Update Quiz</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/plugins/axios';
import { mapGetters } from 'vuex';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default {
  data() {
    return {
      quizzes: [],
      loading: true,
      showCreateModal: false,
      showUpdateModal: false,
      newQuiz: {
        title: '',
        category_id: '',
        description: '',
        image: null,
      },
      currentQuiz: null, // Holds the quiz currently being updated
      currentPage: 1,
      quizzesPerPage: 12, // Set the number of quizzes per page
    };
  },
  computed: {
    ...mapGetters('auth', ['userId']),
    ...mapGetters('categories', ['allCategories']),
    categories() {
      return this.allCategories;
    },
    totalPages() {
      return Math.ceil(this.quizzes.length / this.quizzesPerPage);
    },
    paginatedQuizzes() {
      const start = (this.currentPage - 1) * this.quizzesPerPage;
      const end = start + this.quizzesPerPage;
      return this.quizzes.slice(start, end);
    }
  },
  methods: {
    async fetchQuizzes() {
      try {
        this.loading = true;
        const response = await axios.get(`user-quizzes/${this.userId}`);
        this.quizzes = response.data.quizzes;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      await this.$store.dispatch('categories/fetchCategories');
    },
    openCreateModal() {
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    openUpdateModal(quiz) {
      this.currentQuiz = { ...quiz };
      this.showUpdateModal = true;
    },
    closeUpdateModal() {
      this.showUpdateModal = false;
      this.currentQuiz = null; // Clear the currentQuiz state when modal is closed
    },
    resetView() {
      this.selectedQuiz = null;
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

        await axios.post('/quizzes', formData);
        Swal.fire('Quiz created successfully!', '', 'success'); // Show success message
        this.fetchQuizzes();
        this.closeCreateModal();
      } catch (error) {
        console.error('Error creating quiz:', error);
        Swal.fire('Error', 'Failed to create quiz. Please try again.', 'error'); // Show error message
      }
    },
    async updateQuiz() {
      try {
        const formData = new FormData();
        formData.append('title', this.currentQuiz.title);
        formData.append('category_id', this.currentQuiz.category_id);
        formData.append('description', this.currentQuiz.description);
        if (this.currentQuiz.image) {
          formData.append('image', this.currentQuiz.image);
        }

        await axios.post(`/quizzes/${this.currentQuiz.id}`, formData);
        Swal.fire('Quiz updated successfully!', '', 'success'); // Show success message
        this.fetchQuizzes();
        this.closeUpdateModal();
      } catch (error) {
        console.error('Error updating quiz:', error);
        Swal.fire('Error', 'Failed to update quiz. Please try again.', 'error'); // Show error message
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.newQuiz.image = file;
    },
    onFileChangeUpdate(e) {
      const file = e.target.files[0];
      this.currentQuiz.image = file;
    },
    async deleteQuiz(quizId) {
      try {
        const confirmed = await Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to delete this quiz?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel'
        });
        if (confirmed.isConfirmed) {
          await axios.delete(`/quizzes/${quizId}`);
          Swal.fire('Quiz deleted!', '', 'success');
          this.fetchQuizzes();
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        Swal.fire('Error', 'Failed to delete quiz. Please try again.', 'error'); // Show error message
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    selectQuiz(quiz) {
      this.selectedQuiz = quiz;
    }
  },
  mounted() {
    this.fetchQuizzes();
    this.fetchCategories();
  }
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
