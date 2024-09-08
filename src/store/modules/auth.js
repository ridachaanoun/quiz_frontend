import axios from '../../plugins/axios';

export default {
  namespaced: true,
  state: {
    userData: null,
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = userData;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    clearAuthData(state) {
      state.userData = null;
      state.token = null;
      localStorage.removeItem('token');
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
