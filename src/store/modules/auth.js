import axios from '../../plugins/axios';
import Cookies from 'js-cookie';

export default {
  namespaced: true,
  state: {
    userData: null,
    token: Cookies.get('token') || null, // Get token from cookies
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = userData;
    },
    setToken(state, token) {
      state.token = token;
      Cookies.set('token', token, { expires: 30 }); // Set token in cookies with 30-day expiration
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token for Axios requests
    },
    clearAuthData(state) {
      state.userData = null;
      state.token = null;
      Cookies.remove('token'); // Remove token from cookies
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  actions: {
    async register({ commit, dispatch }, formData) {
      try {
        const response = await axios.post('register', formData);
        commit('setToken', response.data.token); // Set the token in Vuex
        await dispatch('fetchUserData'); // Fetch user data from the server
        return response.data;
      } catch (error) {
        return Promise.reject(error.response.data || { message: 'Unexpected error' });
      }
    },
    async login({ commit, dispatch }, formData) {
      try {
        const response = await axios.post('login', formData);
        commit('setToken', response.data.token); // Set the token in Vuex
        await dispatch('fetchUserData'); // Fetch user data from the server
        return response.data;
      } catch (error) {
        return Promise.reject(error.response.data || { message: 'Unexpected error' });
      }
    },
    async fetchUserData({ commit }) {
      try {
        const response = await axios.get('user');
        commit('setUserData', response.data.profile); // Use response.data.profile
        return response.data.profile;
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        throw error;
      }
    },
    logout({ commit }) {
      commit('clearAuthData');
      location.reload();
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    isAdmin(state) {
      return state.userData && (state.userData.role === 'admin' || state.userData.role === 'super_admin');
    },
    isSuperAdmin(state) {
      return state.userData && (state.userData.role === 'super_admin');
    },
    username(state) {
      return state.userData?.user?.name ?? '';
    },
    userId(state) {
      return state.userData?.user?.id ?? '';
    },
    userProfile(state) {
      return state.userData;
    },
  },
};
