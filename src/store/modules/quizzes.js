import axios from '@/plugins/axios';

export default {
  namespaced: true,
  state: {
    quizzes: [],
    currentQuiz: null,
    quizQuestions: []
  },
  getters: {
    quizzes: (state) => state.quizzes,
    currentQuiz: (state) => state.currentQuiz,
    quizQuestions: (state) => state.quizQuestions
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
        commit('setQuizQuestions', response.data.quiz.questions); // Ensure this line is correct
        console.log(response.data.quiz.questions);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    }
  },
  mutations: {
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes;
    },
    setCurrentQuiz(state, quiz) {
      state.currentQuiz = quiz;
    },
    setQuizQuestions(state, questions) {
      state.quizQuestions = questions;
    }
  }
};
