<template>
    <div>
      <h2 class="text-xl font-bold mb-4">Manage Users</h2>
      <ul>
        <li v-for="user in userList" :key="user.id" class="mb-4 p-4 border border-gray-700 rounded">
          <img v-if="user.profile_picture_url" :src="`http://localhost:8000${user.profile_picture_url}`" alt="Profile Picture" class="w-16 h-16 rounded-full" />
          <p><strong>Name:</strong> {{ user.user.name }}</p>
          <p><strong>Email:</strong> {{ user.user.email }}</p>
          <p><strong>Role:</strong> 
            <template v-if="isSuperAdmin">
                <span>{{ user.role_name }}</span>
              <select v-model="user.role_id" @change="updateRole(user.id, user.role_id)">
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </template>
            <template v-else>
              <span>{{ user.role_name }}</span>
            </template>
          </p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from '@/plugins/axios';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'ManageUsers',
    data() {
      return {
        roles: [
          { id: 1, name: 'Admin' },
          { id: 2, name: 'User' },
          { id: 3, name: 'Super Admin' }
        ]
      };
    },
    computed: {
      ...mapGetters('users', ['allUsers']),
      userList() {
        return this.$store.getters['users/allUsers'];
      },
      isSuperAdmin() {
        return this.$store.getters['auth/isSuperAdmin'];
      }
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      ...mapActions('users', ['fetchUsers']),
      async updateRole(userId, roleId) {
        try {
          await axios.post(`http://localhost:8000/api/users/${userId}/role`, { role_id: roleId });
          console.log('User role updated successfully.');
          // Optionally refresh the user list
          this.fetchUsers();
        } catch (error) {
          console.error('Error updating role:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add styles if needed */
  </style>
  