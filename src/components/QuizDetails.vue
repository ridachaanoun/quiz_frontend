<template>
  <div v-if="currentQuiz">
    <!-- Back Button -->
    <button @click="goBack" class="mt-4 ml-4 py-2 px-4 text-gray-600 hover:text-gray-800 flex items-center">
      <i class="fas fa-chevron-left mr-2"></i>
      <span>Back</span>
    </button>

    <h1 class="text-2xl font-bold mb-4">{{ currentQuiz.title }}</h1>
    <img :src="`http://127.0.0.1:8000/storage/${currentQuiz.image}`" alt="Quiz Image" class="w-full h-auto rounded-md mb-4" />
    <p>{{ currentQuiz.description }}</p>
    <p><strong>Category:</strong> {{ currentQuiz.category.name }}</p>

    <!-- Display Questions -->
    <div v-if="questions.length" class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Questions</h2>
      <ul class="list-disc pl-5">
        <li v-for="question in questions" :key="question.id" class="mb-4">
          <p class="font-medium">{{ question.question }}</p>

          <!-- Show Details Button -->
          <button @click="toggleDetails(question.id)" class="mt-2 py-1 px-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {{ showDetails[question.id] ? 'Hide Details' : 'Show Details' }}
          </button>

          <!-- Update Button -->
          <button @click="editQuestion(question)" class="mt-2 py-1 px-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 ml-2">
            Update Question
          </button>

          <!-- Delete Button -->
          <button @click="deleteQuestion(question.id)" class="mt-2 py-1 px-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-2">
            Delete Question
          </button>

          <!-- Show details only if the respective question's details are toggled -->
          <div v-if="showDetails[question.id]" class="mt-2">
            <ul class="list-inside pl-4">
              <li v-for="(option, key) in question.options" :key="key">
                <span class="font-semibold">{{ key }}:</span> {{ option }}
              </li>
            </ul>
            <p><strong>Correct Option:</strong> {{ question.correct_option }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Button to open the modal for adding a new question -->
    <button @click="openAddModal" class="mt-8 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Add New Question</button>

    <!-- Add or Update Question Modal -->
    <QuestionForm
      v-if="showAddModal || showUpdateModal" 
      :is-update="showUpdateModal"
      :question="currentQuestion"
      @submit="handleQuestionSubmit"
      @close="closeModal"
    />

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg">
      <p>{{ toastMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import QuestionForm from '@/components/QuestionForm.vue'; // Ensure this path is correct
import axios from '@/plugins/axios'; // Ensure this path is correct

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

    const goBack = () => {
      window.history.back(); // Navigate to the previous page instead of reloading
    };

    const openAddModal = () => {
      showAddModal.value = true;
      showUpdateModal.value = false; // Ensure update modal is closed
    };

    const editQuestion = (question) => {
      Object.assign(currentQuestion, question);
      showUpdateModal.value = true;
      showAddModal.value = false; // Ensure add modal is closed
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
      goBack,
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
