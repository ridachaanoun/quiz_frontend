<template>
    <div v-if="currentQuiz" class="min-h-screen bg-gradient-to-r mt-16p-6">
      <div class="container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <!-- Quiz Title -->
        <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">{{ currentQuiz.title }}</h1>
  
        <!-- Quiz Image -->
        <div class="flex justify-center mb-6">
          <img
            :src="currentQuiz.image ? `http://127.0.0.1:8000/storage/${currentQuiz.image}` : require('@/assets/download.jpeg')"
            alt="Quiz Image"
            class="w-full md:w-2/3 h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
  
        <!-- Quiz Description and Category -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label class="block text-gray-600 font-semibold mb-1">Description:</label>
            <p class="text-gray-700 mb-4 break-all">{{ currentQuiz.description }}</p>
          </div>
          <div>
            <p class="text-gray-600 font-semibold"><strong>Category:</strong> {{ currentQuiz.category.name }}</p>
          </div>
        </div>
  
        <!-- Questions Section -->
        <div v-if="questions.length" class="mt-8">
          <h2 class="text-3xl font-semibold mb-6 text-gray-800 text-center">Questions</h2>
          
          <ul class="space-y-6">
            <li
              v-for="(question, index) in questions"
              :key="question.id"
              class="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <p class="font-medium text-gray-800 mb-2">{{ index + 1 }}. {{ question.question }}</p>
  
              <!-- Action Buttons for Each Question -->
              <div class="flex justify-between items-center">
                <div class="space-x-2">
                  <button
                    @click="toggleDetails(question.id)"
                    class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    {{ showDetails[question.id] ? 'Hide Details' : 'Show Details' }}
                  </button>
                  <button
                    @click="editQuestion(question)"
                    class="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  >
                    Update
                  </button>
                  <button
                    @click="deleteQuestion(question.id)"
                    class="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
  
              <!-- Question Details (Options) -->
              <div v-if="showDetails[question.id]" class="mt-4 bg-white p-4 rounded-lg">
                <ul class="list-inside text-gray-700 space-y-2">
                  <li v-for="(option, key) in question.options" :key="key">
                    <span class="font-semibold">{{ key }}:</span> {{ option }}
                  </li>
                </ul>
                <p class="text-gray-700 mt-4"><strong>Correct Option:</strong> {{ question.correct_option }}</p>
              </div>
            </li>
          </ul>
        </div>
  
        <!-- Add New Question Button -->
        <div class="flex justify-center mt-10">
          <button
            @click="openAddModal"
            class="py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Add New Question
          </button>
        </div>
      </div>
  
      <!-- Question Modal -->
      <QuestionForm
        v-if="showAddModal || showUpdateModal"
        :is-update="showUpdateModal"
        :question="currentQuestion"
        @submit="handleQuestionSubmit"
        @close="closeModal"
      />
  
      <!-- Toast Notification -->
      <div v-if="showToast" class="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-md shadow-lg">
        <p>{{ toastMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import QuestionForm from '@/components/QuestionForm.vue';
  import axios from '@/plugins/axios';
  
  export default {
    name: 'QuizDetails',
    components: { QuestionForm },
    props: {
      id: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const store = useStore();
      const showAddModal = ref(false);
      const showUpdateModal = ref(false);
      const showToast = ref(false);
      const toastMessage = ref('');
      const currentQuestion = reactive({
        id: null,
        question: '',
        options: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        correct_option: ''
      });
      const showDetails = reactive({});
  
      const currentQuiz = computed(() => store.getters['quizzes/currentQuiz']);
      const quizQuestions = computed(() => store.getters['quizzes/quizQuestions']);
      const questions = computed(() => quizQuestions.value || []);
  
      const openAddModal = () => {
        showAddModal.value = true;
        showUpdateModal.value = false;
      };
  
      const editQuestion = (question) => {
        Object.assign(currentQuestion, question);
        showUpdateModal.value = true;
        showAddModal.value = false;
      };
  
      const handleQuestionSubmit = async (question) => {
        try {
          if (question.id) {
            await axios.put(`http://localhost:8000/api/questions/${question.id}`, {
              quiz_id: currentQuiz.value.id,
              ...question
            });
            toastMessage.value = 'Question updated successfully!';
          } else {
            await axios.post('http://localhost:8000/api/questions', {
              quiz_id: currentQuiz.value.id,
              ...question
            });
            toastMessage.value = 'Question added successfully!';
          }
          showToast.value = true;
          showAddModal.value = false;
          showUpdateModal.value = false;
          store.dispatch('quizzes/fetchQuizById', currentQuiz.value.id);
          setTimeout(() => {
            showToast.value = false;
          }, 2000);
        } catch (error) {
          console.error('Failed to submit question:', error);
        }
      };
  
      const deleteQuestion = async (questionId) => {
        try {
          await axios.delete(`/questions/${questionId}`);
          toastMessage.value = 'Question deleted successfully!';
          showToast.value = true;
          store.dispatch('quizzes/fetchQuizById', currentQuiz.value.id);
          setTimeout(() => {
            showToast.value = false;
          }, 2000);
        } catch (error) {
          console.error('Failed to delete question:', error);
        }
      };
  
      const toggleDetails = (questionId) => {
        showDetails[questionId] = !showDetails[questionId];
      };
  
      const closeModal = () => {
        showAddModal.value = false;
        showUpdateModal.value = false;
        currentQuestion.id = null;
        currentQuestion.question = '';
        currentQuestion.options = {
          A: '',
          B: '',
          C: '',
          D: ''
        };
        currentQuestion.correct_option = '';
      };
  
      onMounted(() => {
        store.dispatch('quizzes/fetchQuizById', props.id);
      });
  
      return {
        currentQuiz,
        showAddModal,
        showUpdateModal,
        showToast,
        toastMessage,
        currentQuestion,
        questions,
        showDetails,
        openAddModal,
        editQuestion,
        deleteQuestion,
        toggleDetails,
        closeModal,
        handleQuestionSubmit
      };
    }
  };
  </script>
  
  