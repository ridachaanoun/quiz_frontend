// store/modules/categories.js

import axios from '@/plugins/axios';

const state = {
  categories: []
};

const getters = {
  allCategories: (state) => state.categories
};

const actions = {
  async fetchCategories({ commit }) {
    try {
      const response = await axios.get('categories');
      commit('setCategories', response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error.response ? error.response.data : error);
    }
  }
};

const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
