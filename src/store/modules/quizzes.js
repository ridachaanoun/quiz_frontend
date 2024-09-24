import axios from '@/plugins/axios';

export default {
  namespaced: true,
  state: {
    quizzes: [],
    userquizzes: [],
    currentQuiz: null,
    quizQuestions: [],
    userAnswers: {},
    quizCreatorProfile: null,  // Add a new state for quiz creator profile
  },
  getters: {
    quizzes: (state) => state.quizzes,
    userquizzes: (state) => state.userquizzes,
    currentQuiz: (state) => state.currentQuiz,
    quizQuestions: (state) => state.quizQuestions,
    userAnswers: (state) => state.userAnswers,
    quizCreatorProfile: (state) => state.quizCreatorProfile,  // Getter for quiz creator profile
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
    async fetchQuizById({ commit, dispatch }, id) {
      try {
        const response = await axios.get(`quizzes/${id}`);
        commit('setCurrentQuiz', response.data.quiz);
        commit('setQuizQuestions', response.data.quiz.questions);
        
        // Fetch the quiz creator's profile after fetching the quiz
        const creatorId = response.data.quiz.user_id;
        dispatch('fetchProfileByUserId', creatorId);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    },
    async fetchProfileByUserId({ commit }, userId) {
      try {
        const response = await axios.get(`profiles/${userId}`);
        commit('setQuizCreatorProfile', response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    },
    async fetchUserQuizzes({ commit },user_id) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-quizzes/${user_id}`);
        commit('setuserquizzes', response.data.quizzes);
        console.log(response.data.quizzes)
      } catch (error) {
        console.error('Error fetching quizzes:', error);
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
    setuserQuizzes(state, userquizzes) {
      state.userquizzes = userquizzes;
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
    setQuizCreatorProfile(state, profile) {
      state.quizCreatorProfile = profile;
    },
  },
};
