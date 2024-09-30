<template>
  <div v-if="userProfile" class="text-center p-6 rounded-lg mt-16">
    <!-- Profile Picture Section -->
    <div class="relative inline-block">
      <img
        :src="userProfile.profile_picture_url ? `http://127.0.0.1:8000${userProfile.profile_picture_url}` : require('../assets/default user profile.jpg')"
        alt="Profile Picture"
        class="w-32 h-32 rounded-full object-cover border-4 border-gray-600 shadow-lg"
      />
      <button
        @click="toggleDropdown"
        class="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-600 focus:ring focus:ring-blue-500"
      >
        <i class="fas fa-edit"></i>
      </button>
      <!-- Dropdown -->
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10">
        <ul class="text-sm text-gray-300">
          <li>
            <label
              for="profilePicture"
              class="block px-4 py-2 cursor-pointer hover:bg-gray-600"
            >
              Upload a photo...
            </label>
            <input
              type="file"
              id="profilePicture"
              @change="handleFileUpload"
              class="hidden"
            />
          </li>
          <li>
            <button
              @click="removeProfilePicture"
              class="block w-full text-left px-4 py-2 hover:bg-gray-600"
            >
              Remove photo
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bio Section -->
    <div class="mt-6 flex flex-col items-center">
      <samp>{{ userProfile.user.name }}</samp>
      <!-- Display Bio Content -->
      <div class="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-md ">
        <h3 class="text-xl font-semibold text-gray-800">Bio</h3>
        <div class="mt-2 text-gray-700 break-all">
          {{ updatedBio || "No bio available." }}
        </div>
      </div>

      <button
        @click="showUpdateBioModal = true"
        class="mt-3 w-32 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-500"
      >
        Update Bio
      </button>

      <!-- Update Bio Popup -->
      <div v-if="showUpdateBioModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl">
          <h3 class="text-lg font-bold">Update Bio</h3>
          <textarea
            v-model="updatedBio"
            class="mt-2 p-2 w-6/12 rounded-md bg-gray-100 text-gray-900 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="5"
            placeholder="Enter your new bio..."
            style="height: 150px; overflow-y: auto;"
          ></textarea>
          <div class="flex mt-4 justify-end">
            <button @click="updateUserBio" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save
            </button>
            <button @click="showUpdateBioModal = false" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Buttons -->
    <div class="mt-8 text-lg text-gray-300 space-y-6">
      <button
        @click="showUpdateNameModal = true"
        class="bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-700 flex items-center"
      >
        <i class="fas fa-user-edit mr-2"></i> Update Name
      </button>

      <button
        @click="showUpdateEmailModal = true"
        class="bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-700 flex items-center"
      >
        <i class="fas fa-envelope mr-2"></i> Update Email
      </button>

      <button
        @click="showUpdatePasswordModal = true"
        class="bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-700 flex items-center"
      >
        <i class="fas fa-key mr-2"></i> Update Password
      </button>
    </div>

    <!-- Name Update Modal -->
    <div v-if="showUpdateNameModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl mb-4">Update Name</h2>
        <input
          v-model="updatedUsername"
          type="text"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter new name"
        />
        <button
          @click="updateUserName"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          @click="showUpdateNameModal = false"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Email Update Modal -->
    <div v-if="showUpdateEmailModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl mb-4">Update Email</h2>
        <input
          v-model="updatedEmail"
          type="email"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter new email"
        />
        <button
          @click="updateUserEmail"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          @click="showUpdateEmailModal = false"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Password Update Modal -->
    <div v-if="showUpdatePasswordModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl mb-4">Update Password</h2>
        <input
          v-model="currentPassword"
          type="password"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Current password"
        />
        <input
          v-model="updatedPassword"
          type="password"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="New password"
        />
        <input
          v-model="passwordConfirmation"
          type="password"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Confirm new password"
        />
        <button
          @click="updateUserPassword"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          @click="showUpdatePasswordModal = false"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  <Attempts />

</template>

<script>
import axios from '@/plugins/axios';
import { mapGetters, mapActions } from 'vuex';
import Swal from 'sweetalert2';
import Attempts from '@/components/AttemptsOfUser.vue'; // Import SweetAlert2

export default {
   components: {
    Attempts, 
  },
  data() {
    return {
      showUpdateNameModal: false,
      showUpdateEmailModal: false,
      showUpdatePasswordModal: false,
      currentPassword: '',
      updatedPassword: '',
      passwordConfirmation: '',
      updatedBio: '',
      updatedUsername: '',
      updatedEmail: '',
      showDropdown: false,
      newProfilePicture: null, // Add this for file upload
      showUpdateBioModal: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['userProfile']),
  },
  mounted() {
    this.loadUserProfile();
  },
  methods: {
    ...mapActions('auth', ['fetchUserData']),
    
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async loadUserProfile() {
      try {
        await this.fetchUserData();
        this.updatedBio = this.userProfile.bio;
        this.updatedUsername = this.userProfile.user.name;
        this.updatedEmail = this.userProfile.user.email;
      } catch (error) {
        this.showErrorPopup('Failed to load user profile.');
      }
    },

    handleFileUpload(event) {
      this.newProfilePicture = event.target.files[0];
      this.updateProfilePicture();
    },

    async updateProfilePicture() {
      if (!this.newProfilePicture) {
        alert("Please select a picture before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", this.newProfilePicture);

      try {
        const response = await axios.post("http://localhost:8000/api/profile/picture", formData);
        this.userProfile.profile_picture_url = response.data.profile_picture_url;
        this.showSuccessPopup('Profile picture updated successfully.');
      } catch (error) {
        console.error("Error updating profile picture:", error);
        this.showErrorPopup('Failed to update profile picture.');
      }
    },

    async removeProfilePicture() {
      try {
        await axios.post("http://localhost:8000/api/profile/remove-picture");
        this.userProfile.profile_picture_url = null; // Clear the profile picture
        this.showSuccessPopup('Profile picture removed successfully.');
      } catch (error) {
        console.error("Error removing profile picture:", error);
        this.showErrorPopup('Failed to remove profile picture.');
      }
    },

    async updateUserBio() {
      try {
        await axios.post('profile/bio', { bio: this.updatedBio });
        this.userProfile.bio = this.updatedBio;
        this.showSuccessPopup('Bio updated successfully!');
      } catch (error) {
        this.showErrorPopup('Failed to update bio.');
      }
    },

    async updateUserName() {
      try {
        await axios.put('user/update-username', { name: this.updatedUsername });
        this.userProfile.user.name = this.updatedUsername;
        this.showUpdateNameModal = false;
        this.showSuccessPopup('Username updated successfully!');
      } catch (error) {
        this.showErrorPopup('Failed to update username.');
      }
    },

    async updateUserEmail() {
      try {
        await axios.put('user/update-email', { email: this.updatedEmail });
        this.userProfile.user.email = this.updatedEmail;
        this.showUpdateEmailModal = false;
        this.showSuccessPopup('Email updated successfully!');
      } catch (error) {
        this.showErrorPopup('Failed to update email.');
      }
    },

    async updateUserPassword() {
      try {
        await axios.put('user/update-password', {
          current_password: this.currentPassword,
          password: this.updatedPassword,
          password_confirmation: this.passwordConfirmation,
        });
        this.showUpdatePasswordModal = false;
        this.currentPassword= null;
        this.updatedPassword= null;
        this.passwordConfirmation= null;
        this.showSuccessPopup('Password updated successfully!');
      } catch (error) {
        this.showErrorPopup('Failed to update password.');
      }
    },


    showSuccessPopup(message) {
      Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    },

    showErrorPopup(message) {
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
