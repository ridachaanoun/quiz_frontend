// // src/store/modules/categories.js
// import axios from '../../plugins/axios'; // Adjust the path based on your project structure

// export default {
//   namespaced: true,
//   state: {
//     categories: [],
//   },
//   mutations: {
//     setCategories(state, categories) {
//       state.categories = categories;
//     },
//     addCategory(state, category_) {
//       state.categories.push(category_);
//     },
//   },
//   actions: {
//     async createCategory({ commit }, formData) {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No token found');
//         }

//         const response = await axios.post('categories', formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         commit('addCategory', response.data.category);
//         return response.data;
//       } catch (error) {
//         console.error('Category creation error:', error.response.data);
//         throw error;
//       }
//     },
//   },
// };
