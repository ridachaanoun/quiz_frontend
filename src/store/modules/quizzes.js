import axios from '@/plugins/axios';

export default {
  namespaced: true,
  state: {
    quizzes: [],
    currentQuiz: null,
    quizQuestions: [],
    userAnswers: {},
  },
  getters: {
    quizzes: (state) => state.quizzes,
    currentQuiz: (state) => state.currentQuiz,
    quizQuestions: (state) => state.quizQuestions,
    userAnswers: (state) => state.userAnswers,
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
        commit('setQuizQuestions', response.data.quiz.questions);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    },
    saveAnswer({ commit }, { questionId, answer }) {
      commit('setUserAnswer', { questionId, answer });
    },
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
    },
    setUserAnswer(state, { questionId, answer }) {
      state.userAnswers = { ...state.userAnswers, [questionId]: answer };
    },
  },
};

