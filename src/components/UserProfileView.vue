<template>
  <div class="flex flex-col md:flex-row mt-16">
    <!-- Fixed Sidebar for User Information -->
    <aside class="w-full md:w-64 bg-gray-800 text-white p-6 overflow-y-auto md:fixed md:h-screen">
      <div v-if="profile" class="flex flex-col items-center">
        <!-- Profile Picture -->
        <img :src="`http://127.0.0.1:8000${profile.profile_picture_url}`" alt="Profile Picture" class="w-32 h-32 rounded-full mb-4 border-4 border-gray-600" />

        <!-- User Info -->
        <h2 class="text-2xl font-bold mb-2 text-center">{{ profile.user.name }}</h2>
        <p class="text-lg text-gray-400 text-center break-all mb-4">{{ profile.bio }}</p>

        <!-- User Join Date -->
        <div class="mt-4 text-center">
          <span class="block text-md font-medium text-gray-500">Joined:</span>
          <p class="text-lg">{{ joinDate }}</p>
        </div>

        <!-- Follow/Unfollow Button -->
        <button @click="toggleFollow" class="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </button>

        <!-- Show Followers Button -->
        <button @click="showFollowers" class="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300">
          Show Followers
        </button>

        <!-- Followers Modal -->
        <div v-if="showFollowersModal" class="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div class="bg-white p-6 rounded shadow-lg w-96">
            <h3 class="text-xl font-bold mb-4">Followers</h3>
            <ul>
              <li v-for="follower in followers" :key="follower.id" class="mb-2 flex items-center space-x-4">
                <a @click.prevent="navigateToFollowerProfile(follower.id)">
                  <img :src="follower.profile_picture ? `http://127.0.0.1:8000${follower.profile_picture}` : 'http://127.0.0.1:8000/storage/default-profile.png'" alt="Profile Picture" class="w-16 h-16 rounded-full object-cover" />
                </a>
                <div>
                  <p class="text-orange-500">{{ follower.name }}</p>
                </div>
              </li>
            </ul>
            <button @click="showFollowersModal = false" class="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300">
              Close
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
        <p class="mt-4 text-lg">Loading profile...</p>
      </div>
    </aside>

    <!-- Main Content for Quizzes -->
    <main class="flex-1 p-6 md:ml-64">
      <!-- Display Quizzes with Pagination -->
      <div v-if="paginatedQuizzes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="quiz in paginatedQuizzes" :key="quiz.id" :style="{ backgroundImage: `url('http://127.0.0.1:8000/storage/${quiz.image}')` }" 
                class="relative bg-cover bg-center h-64 rounded-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 z-10"
             @click="goToQuizDetails(quiz.id)">
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white p-4">
            <div>
              <h2 class="text-lg font-semibold">{{ quiz.title }}</h2>
              <p class="text-sm break-all overflow-hidden h-16">{{ quiz.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-6 text-gray-500">No quizzes found</div>

      <!-- Pagination Controls -->
      <div v-if="!selectedQuiz" class="flex justify-center mt-6">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="['px-4 py-2 mx-1 rounded-md', { 'bg-indigo-600 text-white': page === currentPage, 'bg-gray-300 hover:bg-gray-400': page !== currentPage }]">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import axios from '@/plugins/axios'; // Import Axios

export default {
  name: 'UserProfileView',
  data() {
    return {
      profile: null,
      isFollowing: false,
      showFollowersModal: false,
      followers: [],
      quizzes: [],
      paginatedQuizzes: [],
      currentPage: 1,
      quizzesPerPage: 8,
    };
  },
  computed: {
    joinDate() {
      return this.profile ? new Date(this.profile.created_at).toLocaleDateString() : '';
    },
    totalPages() {
      return Math.ceil(this.quizzes.length / this.quizzesPerPage);
    }
  },
  created() {
    this.fetchUserProfile();
    this.fetchUserQuizzes();
  },
  methods: {
    async fetchUserProfile() {
      const userId = this.$route.params.userId;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/profiles/${userId}`);
        this.profile = response.data;
        await this.checkIfFollowing();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    async fetchUserQuizzes() {
      const userId = this.$route.params.userId;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-quizzes/${userId}`);
        this.quizzes = response.data.quizzes;
        this.paginateQuizzes();
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    paginateQuizzes() {
      const start = (this.currentPage - 1) * this.quizzesPerPage;
      const end = start + this.quizzesPerPage;
      this.paginatedQuizzes = this.quizzes.slice(start, end);
    },
    changePage(page) {
      this.currentPage = page;
      this.paginateQuizzes();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginateQuizzes();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginateQuizzes();
      }
    },
    async checkIfFollowing() {
      const userId = this.$route.params.userId;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/is-following/${userId}`);
        this.isFollowing = response.data.isFollowing;
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    },
    async toggleFollow() {
      const userId = this.$route.params.userId;
      try {
        if (this.isFollowing) {
          await axios.post(`http://127.0.0.1:8000/api/unfollow/${userId}`);
          this.isFollowing = false;
        } else {
          await axios.post(`http://127.0.0.1:8000/api/follow/${userId}`);
          this.isFollowing = true;
        }
      } catch (error) {
        console.error('Error toggling follow status:', error);
      }
    },
    async showFollowers() {
        const userId = this.$route.params.userId;
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/followers/${userId}`);
          this.followers = response.data.followers;
          this.showFollowersModal = true;
        } catch (error) {
          console.error('Error fetching followers:', error);
        }
      },
    goToQuizDetails(id) {
      this.$router.push({ name: 'QuizDetails', params: { id } });
    }
  }
};
</script>

<style scoped>
/* Add any necessary custom styles here */
</style>
