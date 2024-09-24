<template>
  <div class=" mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Manage Users</h2>
    <ul class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <li
        v-for="user in userList"
        :key="user.id"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex items-center space-x-4 mb-4">
          <img
            v-if="user.profile_picture_url"
            :src="`http://localhost:8000${user.profile_picture_url}`"
            alt="Profile Picture"
            class="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <p class="text-lg font-semibold text-gray-700">{{ user.user.name }}</p>
            <p class="text-sm text-gray-500 break-all ">{{ user.user.email }}</p>
          </div>
        </div>
        <div>
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
      roles: [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
        { id: 3, name: 'Super Admin' },
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['allUsers']),
    userList() {
      return this.allUsers;
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
  },
};
</script>

<style scoped>
/* Optional custom styles */
.container {
  max-width: 1200px; /* Ensure container does not exceed a certain width */
}

h2 {
  font-family: 'Arial', sans-serif; /* Change font style if desired */
}

/* You can add additional custom styles here */
</style>
