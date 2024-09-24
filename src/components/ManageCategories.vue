<template>
  <div class="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">Manage Categories</h1>

    <!-- Create Category Form -->
    <form @submit.prevent="createCategory" class="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        v-model="newCategoryName"
        placeholder="Enter Category Name"
        class="flex-1 border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 transition duration-300 shadow-md"
        required
      />
      <button
        type="submit"
        class="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
      >
        Create Category
      </button>
    </form>

    <!-- Display Categories -->
    <div v-if="categories.length">
      <ul class="space-y-3">
        <li
          v-for="category in sortedCategories"
          :key="category.id"
          class="flex items-center justify-between bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300"
        >
          <span class="text-lg font-medium text-gray-700">{{ category.name }}</span>
          <div>
            <button
              @click="confirmDelete(category.id)"
              class="bg-red-600 text-white py-1 px-3 rounded-lg shadow hover:bg-red-700 transition duration-300 mr-2"
            >
              Delete
            </button>
            <button
              @click="editCategory(category)"
              class="bg-yellow-600 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-700 transition duration-300"
            >
              Edit
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-500 text-center mt-4">No categories found</div>

    <!-- Edit Category Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Edit Category</h2>
        <form @submit.prevent="updateCategory">
          <input
            v-model="editedCategory.name"
            placeholder="New Category Name"
            class="w-full border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 transition duration-300 mb-4"
            required
          />
          <div class="flex justify-end gap-4">
            <button
              type="submit"
              class="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
            >
              Update Category
            </button>
            <button
              @click="closeEditModal"
              class="bg-gray-400 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from '@/plugins/axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      newCategoryName: '',
      showEditModal: false,
      editedCategory: null,
    };
  },
  computed: {
    ...mapGetters('categories', ['allCategories']),
    sortedCategories() {
      return this.allCategories.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    categories() {
      return this.allCategories;
    },
  },
  methods: {
    ...mapActions('categories', ['fetchCategories']),
    async createCategory() {
      try {
        // Fetch the latest categories to ensure up-to-date data
        await this.fetchCategories();

        // Check if the category already exists
        const existingCategory = this.categories.find(
          (category) => category.name.toLowerCase() === this.newCategoryName.toLowerCase()
        );

        // If the category exists, show an alert
        if (existingCategory) {
          Swal.fire({
            icon: 'warning',
            title: 'Category Exists',
            text: `The category "${this.newCategoryName}" already exists. Please choose a different name.`,
          });
        } else {
          // If the category doesn't exist, create it
          const response = await axios.post('categories', { name: this.newCategoryName });
          this.categories.push(response.data.category);
          this.newCategoryName = '';
          Swal.fire({
            icon: 'success',
            title: 'Category Created',
            text: `The category "${response.data.category.name}" has been created successfully.`,
          });
        }
      } catch (error) {
        console.error('Failed to create category:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create category. Please try again.',
        });
      }
    },
    async confirmDelete(id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        this.deleteCategory(id);
      }
    },
    async deleteCategory(id) {
      try {
        await axios.delete(`categories/${id}`);
        this.fetchCategories(); // Refresh categories
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          text: 'The category has been deleted successfully.',
        });
      } catch (error) {
        console.error('Failed to delete category:', error.response ? error.response.data : error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete category. Please try again.',
        });
      }
    },
    editCategory(category) {
      this.editedCategory = { ...category };
      this.showEditModal = true;
    },
    async updateCategory() {
      try {
        await axios.put(`categories/${this.editedCategory.id}`, { name: this.editedCategory.name });
        this.fetchCategories(); // Refresh categories
        this.showEditModal = false;
        this.editedCategory = null;
        Swal.fire({
          icon: 'success',
          title: 'Category Updated',
          text: `The category has been updated successfully.`,
        });
      } catch (error) {
        console.error('Failed to update category:', error.response ? error.response.data : error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update category. Please try again.',
        });
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editedCategory = null;
    },
  },
  async created() {
    await this.fetchCategories();
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
