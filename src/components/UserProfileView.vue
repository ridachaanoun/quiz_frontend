<template>
    <div class="container mx-auto p-6">
      <div v-if="profile" class="flex flex-col items-center">
        <!-- Profile Picture -->
        <img :src="`http://127.0.0.1:8000${profile.profile_picture_url}`" alt="Profile Picture" class="w-32 h-32 rounded-full mb-4" />
  
        <!-- User Info -->
        <h2 class="text-2xl font-bold mb-2">{{ profile.user.name }}</h2>
        <p class="text-lg text-gray-600">{{ profile.bio }}</p>
  
        <!-- User Join Date -->
        <div class="mt-4">
          <span class="block text-md font-medium text-gray-500">Joined:</span>
          <p class="text-lg">{{ joinDate }}</p>
        </div>
  
        <!-- Follow/Unfollow Button -->
        <button @click="toggleFollow" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {{ isFollowing ? 'Unfollow' : 'Follow' }}
        </button>
  
        <!-- Show Followers Button -->
        <button @click="showFollowers" class="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Show Followers
        </button>
  
<!-- Followers Modal -->
<div v-if="showFollowersModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded shadow-lg w-96">
    <h3 class="text-xl font-bold mb-4">Followers</h3>
    <ul>
      <li v-for="follower in followers" :key="follower.id" class="mb-2 flex items-center space-x-4">
        <!-- Clicking on the image will navigate to the follower's profile -->
        <a @click.prevent="navigateToFollowerProfile(follower.id)">
          <img
            :src="follower.profile_picture ? `http://127.0.0.1:8000${follower.profile_picture}` : 'http://127.0.0.1:8000/storage/default-profile.png'"
            alt="Profile Picture"
            class="w-16 h-16 rounded-full object-cover"
          />
        </a>
        <div>
          <p class="font-semibold">{{ follower.name }}</p>
        </div>
      </li>
    </ul>
    <button @click="showFollowersModal = false" class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
      Close
    </button>
  </div>
</div>

      </div>
  
      <div v-else class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
        <p class="mt-4 text-lg">Loading profile...</p>
      </div>
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
      showFollowersModal: false, // Track the visibility of the followers modal
      followers: [], // Store followers data
    };
  },
  computed: {
    joinDate() {
      return this.profile ? new Date(this.profile.created_at).toLocaleDateString() : '';
    },
  },
  created() {
    this.fetchUserProfile();
  },
  watch: {
    // Watch for changes in the route parameter (userId)
    '$route.params.userId'() {
      this.fetchUserProfile(); // Fetch the new profile when userId changes
    }
  },
  methods: {
    async fetchUserProfile() {
      const userId = this.$route.params.userId;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/profiles/${userId}`);
        this.profile = response.data;
        await this.checkIfFollowing(); // Check if the user is following
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
          const response = await axios.post(`http://127.0.0.1:8000/api/follow/${userId}`);
          if (response.data.message === "You are already following this user") {
            console.log('You are already following this user');
          }
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
    // Method to navigate to the selected follower's profile
    navigateToFollowerProfile(followerId) {
      this.$router.push({ name: 'UserProfileView', params: { userId: followerId }  });
      this.showFollowersModal = false; // Close the modal after navigating
    }
  }
};

  </script>
  
  <style scoped>
  /* Add any additional scoped styles here */
  </style>
  