<template>
    <div>
      <h1>Categories</h1>
      <button @click="showCreateCategoryModal = true">Add Category</button>
  
      <!-- Categories List -->
      <ul v-if="categories.length">
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <button @click="editCategory(category)">Edit</button>
          <button @click="deleteCategory(category.id)">Delete</button>
        </li>
      </ul>
      <p v-else>No categories found.</p>
  
      <!-- Create Category Modal -->
      <div v-if="showCreateCategoryModal" class="modal">
        <h2>Create Category</h2>
        <input v-model="newCategoryName" placeholder="Category name" />
        <button @click="createCategory">Create</button>
        <button @click="showCreateCategoryModal = false">Cancel</button>
      </div>
  
      <!-- Edit Category Modal -->
      <div v-if="showEditCategoryModal" class="modal">
        <h2>Edit Category</h2>
        <input v-model="editedCategoryName" placeholder="Category name" />
        <button @click="updateCategory">Update</button>
        <button @click="showEditCategoryModal = false">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '@/plugins/axios';
  
  export default {
    data() {
      return {
        categories: [],
        newCategoryName: '',
        editedCategoryName: '',
        currentCategoryId: null,
        showCreateCategoryModal: false,
        showEditCategoryModal: false,
      };
    },
    methods: {
      async fetchCategories() {
        try {
          const response = await axios.get('categories');
          this.categories = response.data.categories;
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },
      async createCategory() {
        try {
          const response = await axios.post('categories', { name: this.newCategoryName });
          this.categories.push(response.data);
          this.newCategoryName = '';
          this.showCreateCategoryModal = false;
        } catch (error) {
          console.error('Error creating category:', error);
        }
      },
      async deleteCategory(categoryId) {
        try {
          await axios.delete(`categories/${categoryId}`);
          this.categories = this.categories.filter(category => category.id !== categoryId);
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      },
      async updateCategory() {
        try {
          await axios.put(`categories/${this.currentCategoryId}`, { name: this.editedCategoryName });
          const category = this.categories.find(c => c.id === this.currentCategoryId);
          if (category) {
            category.name = this.editedCategoryName;
          }
          this.editedCategoryName = '';
          this.showEditCategoryModal = false;
        } catch (error) {
          console.error('Error updating category:', error);
        }
      },
      editCategory(category) {
        this.currentCategoryId = category.id;
        this.editedCategoryName = category.name;
        this.showEditCategoryModal = true;
      },
    },
    created() {
      this.fetchCategories();
    },
  };
  </script>
  
  <style scoped>
  /* Add styles for modal and other elements */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  </style>
  