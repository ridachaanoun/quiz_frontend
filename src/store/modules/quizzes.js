import axios from '@/plugins/axios'; // Adjust the path as needed

export default {
  namespaced: true,
  state: {
    quizzes: [],
    currentQuiz: null, // Add state for current quiz details
  },
  getters: {
    quizzes: (state) => state.quizzes,
    currentQuiz: (state) => state.currentQuiz, // Getter for current quiz details
  },
  actions: {
    async fetchQuizzes({ commit }) {
      try {
        const response = await axios.get('quizzes');
        commit('setQuizzes', response.data.quizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    },
    async fetchQuizById({ commit }, id) {
      try {
        const response = await axios.get(`quizzes/${id}`);
        commit('setCurrentQuiz', response.data.quiz);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    },
  },
  mutations: {
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes;
    },
    setCurrentQuiz(state, quiz) {
      state.currentQuiz = quiz;
    },
  },
};
