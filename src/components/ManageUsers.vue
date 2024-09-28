<template>
  <div class="container mx-auto p-6">
    <h2 class="text-4xl font-bold text-gray-800 mb-12 text-center">Manage Users</h2>
    
    <!-- Loading Indicator with Icon -->
    <div v-if="loading" class="text-center flex items-center justify-center">
      <svg
        class="animate-spin h-8 w-8 mr-3 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
      </svg>
      <p class="text-gray-700">Loading users...</p>
    </div>
    
    <ul v-else class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <li
        v-for="user in paginatedUsers"
        :key="user.id"
        class="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
      >
        <div class="flex flex-col items-center mb-4">
          <div class="relative group">
            <img
              v-if="user.profile_picture_url"
              :src="`http://localhost:8000${user.profile_picture_url}`"
              alt="Profile Picture"
              class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <img
              v-else
              src="@/assets/default user profile.jpg"
              alt="Default Profile Picture"
              class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
          <div class="text-center mt-4">
            <p class="text-xl font-semibold text-gray-700">{{ user.user.name }}</p>
            <p class="text-sm text-gray-500 break-all">{{ user.user.email }}</p>
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-600 mb-2">Role:</p>
          <template v-if="isSuperAdmin">
            <div class="relative">
              <select
                v-model="user.role_id"
                @change="updateRole(user.id, user.role_id)"
                class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                <option :value="user.role_id">{{ user.role_name }}</option>
                <option
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                  :disabled="role.id === user.role_id"
                >
                  {{ role.name }}
                </option>
              </select>
            </div>
          </template>
          <template v-else>
            <span class="text-gray-700 font-medium">{{ user.role_name }}</span>
          </template>
        </div>
      </li>
    </ul>
    
    <!-- Pagination Controls -->
    <div class="flex justify-center mt-8">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span class="mx-4 text-lg">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from '@/plugins/axios';
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: 'ManageUsers',
  data() {
    return {
      loading: true,
      currentPage: 1,
      itemsPerPage: 5, // Set the number of items per page
      roles: [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
        { id: 3, name: 'Super Admin' },
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['allUsers']),
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allUsers.slice(start, end); // Slice the user list for pagination
    },
    totalPages() {
      return Math.ceil(this.allUsers.length / this.itemsPerPage);
    },
    isSuperAdmin() {
      return this.$store.getters['auth/isSuperAdmin'];
    },
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    ...mapActions('users', ['fetchUsers']),
    async updateRole(userId, roleId) {
      try {
        await axios.put(`http://localhost:8000/api/users/${userId}/role`, { role_id: roleId });
        
        // SweetAlert2 success notification
        Swal.fire({
          title: 'Success!',
          text: 'User role updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Refresh the user list
        this.fetchUsers();
      } catch (error) {
        console.error('Error updating role:', error);
        
        // SweetAlert2 error notification
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update user role. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
    async fetchUsers() {
      this.loading = true; // Start loading
      try {
        await this.$store.dispatch('users/fetchUsers'); // Assuming fetchUsers fetches and commits to the store
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false; // End loading
      }
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

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-family: 'Arial', sans-serif;
  margin-bottom: 2rem;
}

ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

li {
  transition: transform 0.3s ease-in-out;
}

li:hover {
  transform: translateY(-10px);
}

img {
  transition: transform 0.3s ease-in-out;
}

img:hover {
  transform: scale(1.1);
}

.group-hover\:scale-110:hover {
  transform: scale(1.1);
}

select {
  font-size: 1rem;
  font-family: 'Arial', sans-serif;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}

select:focus {
  border-color: #4f46e5;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
