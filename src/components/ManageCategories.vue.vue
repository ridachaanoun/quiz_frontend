<template>
    <div class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-semibold mb-6">Manage Categories</h1>
  
      <!-- Create Category Form -->
      <form @submit.prevent="createCategory" class="mb-6 flex gap-4">
        <input
          v-model="newCategoryName"
          placeholder="Category Name"
          class="flex-1 border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 transition duration-300"
          required
        />
        <button
          type="submit"
          class="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          Create Category
        </button>
      </form>
  
      <!-- Display Categories -->
      <div v-if="categories.length">
        <ul class="space-y-2">
          <li v-for="category in categories" :key="category.id" class="flex items-center justify-between border-b pb-2">
            <span class="text-lg">{{ category.name }}</span>
            <div>
              <button
                @click="deleteCategory(category.id)"
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
        <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 class="text-2xl font-semibold mb-4">Edit Category</h2>
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
                class="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
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
  import axios from '@/plugins/axios'; // Adjust the path as needed
  
  export default {
    data() {
      return {
        categories: [],
        newCategoryName: '',
        showEditModal: false,
        editedCategory: null,
      };
    },
    async created() {
      await this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        try {
          const response = await axios.get('categories');
          this.categories = response.data.categories;
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },
      async createCategory() {
        try {
          const response = await axios.post('categories', { name: this.newCategoryName });
          this.categories.push(response.data.category);
          this.newCategoryName = '';
        } catch (error) {
          console.error('Failed to create category:', error);
        }
      },
      async deleteCategory(id) {
        const confirmed = window.confirm('Do you want to delete this category?');
        if (confirmed) {
          try {
            await axios.delete(`categories/${id}`);
            this.categories = this.categories.filter(category => category.id !== id);
          } catch (error) {
            console.error('Failed to delete category:', error);
          }
        }
      },
      editCategory(category) {
        this.editedCategory = { ...category };
        this.showEditModal = true;
      },
      async updateCategory() {
        try {
          await axios.put(`categories/${this.editedCategory.id}`, { name: this.editedCategory.name });
          const index = this.categories.findIndex(category => category.id === this.editedCategory.id);
          if (index !== -1) {
            this.categories[index] = { ...this.editedCategory };
          }
          this.showEditModal = false;
          this.editedCategory = null;
        } catch (error) {
          console.error('Failed to update category:', error);
        }
      },
      closeEditModal() {
        this.showEditModal = false;
        this.editedCategory = null;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  