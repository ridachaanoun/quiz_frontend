// store/modules/notifications.js
import axios from '@/plugins/axios';

const state = {
  notifications: [],
};

const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications;
  },
};

const actions = {
  async fetchNotifications({ commit }) {
    try {
      const response = await axios.get('notifications');
      commit('SET_NOTIFICATIONS', response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },
};

const getters = {
  unreadNotificationsCount: (state) => {
    return state.notifications.filter((notification) => notification.read === 0).length;
  },
  allNotifications: (state) => state.notifications,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
