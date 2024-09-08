import axios from '@/plugins/axios';

export default {
  namespaced: true,
  state: {
    users: []
  },
  getters: {
    allUsers: (state) => state.users
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get('http://localhost:8000/api/profiles');
        commit('setUsers', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    }
  }
};
