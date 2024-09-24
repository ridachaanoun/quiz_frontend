<template>
  <div v-if="currentQuiz" class=" mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ currentQuiz.title }}</h1>
    <img
      :src="`http://127.0.0.1:8000/storage/${currentQuiz.image}`"
      alt="Quiz Image"
      class="w-full h-auto rounded-lg shadow-lg mb-4"
    />
    
    <!-- Added label for description -->
    <label class="block text-gray-600 font-semibold mb-1">Description:</label>
    <p class="text-gray-700 mb-2 break-all">{{ currentQuiz.description }}</p>
    
    <p class="text-gray-600"><strong>Category:</strong> {{ currentQuiz.category.name }}</p>

    <!-- Display Questions -->
    <div v-if="questions.length" class="mt-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Questions</h2>
      <ul class="list-disc pl-5">
        <li
          v-for="(question, index) in questions"
          :key="question.id"
          class="mb-6 bg-white p-4 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg list-none"
        >
          <p class="font-medium text-gray-800">
            {{ index + 1 }}. {{ question.question }}
          </p>

          <div class="flex space-x-2 mt-2">
            <!-- Show Details Button -->
            <button
              @click="toggleDetails(question.id)"
              class="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              {{ showDetails[question.id] ? 'Hide Details' : 'Show Details' }}
            </button>

            <!-- Update Button -->
            <button
              @click="editQuestion(question)"
              class="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
            >
              Update Question
            </button>

            <!-- Delete Button -->
            <button
              @click="deleteQuestion(question.id)"
              class="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            >
              Delete Question
            </button>
          </div>

          <!-- Show details only if the respective question's details are toggled -->
          <div v-if="showDetails[question.id]" class="mt-2 bg-gray-100 p-2 rounded-md">
            <ul class="list-inside pl-4 text-gray-600">
              <li v-for="(option, key) in question.options" :key="key">
                <span class="font-semibold">{{ key }}:</span> {{ option }}
              </li>
            </ul>
            <p class="text-gray-600"><strong>Correct Option:</strong> {{ question.correct_option }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Button to open the modal for adding a new question -->
    <button
      @click="openAddModal"
      class="mt-8 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
    >
      Add New Question
    </button>

    <!-- Add or Update Question Modal -->
    <QuestionForm
      v-if="showAddModal || showUpdateModal" 
      :is-update="showUpdateModal"
      :question="currentQuestion"
      @submit="handleQuestionSubmit"
      @close="closeModal"
    />

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg transition-opacity duration-300">
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

<style scoped>
.container {
  max-width: 800px; /* Adjust max width for better readability */
}

h1, h2 {
  font-family: 'Helvetica', 'Arial', sans-serif; /* Use a clean sans-serif font */
}

button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  transform: scale(1.05); /* Slight scale on hover for better interactivity */
}

.bg-green-600 {
  background-color: #38a169; /* Use a slightly different shade */
}

.bg-blue-600 {
  background-color: #3182ce; /* Use a slightly different shade */
}

.bg-yellow-500 {
  background-color: #d69e2e; /* Use a slightly different shade */
}

.bg-red-600 {
  background-color: #e53e3e; /* Use a slightly different shade */
}
</style>
