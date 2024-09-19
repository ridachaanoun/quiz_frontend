import axios from '../../plugins/axios';

export default {
  namespaced: true,
  state: {
    userData: null,
    token: sessionStorage.getItem('token') || null, // Store token in session storage
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = userData;
    },
    setToken(state, token) {
      state.token = token;
      sessionStorage.setItem('token', token);  // Persist token in session storage
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token for Axios requests
    },
    clearAuthData(state) {
      state.userData = null;
      state.token = null;
      sessionStorage.removeItem('token'); // Use session storage
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  actions: {
    async register({ commit, dispatch }, formData) {
      try {
        const response = await axios.post('register', formData);
        commit('setUserData', response.data.user);
        commit('setToken', response.data.token);
        await dispatch('fetchUserData');
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return Promise.reject(error.response.data);
        } else {
          return Promise.reject({ message: 'An unexpected error occurred' });
        }
      }
    },
    async login({ commit, dispatch }, formData) {
      try {
        const response = await axios.post('login', formData);
        // Ensure token and user data are in the response
        commit('setUserData', response.data.user);  // Set the user data
        commit('setToken', response.data.token);    // Set the token in Vuex
        await dispatch('fetchUserData');            // Fetch additional user data if needed
        return response.data;
      } catch (error) {
        return Promise.reject(error.response.data || { message: 'Unexpected error' });
      }
    },
    async fetchUserData({ commit }) {
      try {
        const response = await axios.get('user');
        // Update to handle new API response structure
        commit('setUserData', response.data.profile); // Use response.data.profile
        return response.data.profile;
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        throw error;
      }
    },
    logout({ commit }) {
      commit('clearAuthData');
      location.reload()
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
  },
};
