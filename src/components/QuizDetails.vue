<template>
  <div v-if="currentQuiz">

    
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
          <button @click="toggleDetails(question.id)" class="mt-2 py-1 px-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {{ showDetails[question.id] ? 'Hide Details' : 'Show Details' }}
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
    
    <!-- Button to open the modal -->
    <button @click="showModal = true" class="mt-8 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Add New Question</button>
    
    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <!-- Close Button -->
        <button @click="showModal = false" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="text-xl font-semibold mb-4">Add a New Question</h2>
        <form @submit.prevent="addQuestion">
          <div class="mb-4">
            <label for="question" class="block text-sm font-medium text-gray-700">Question</label>
            <input v-model="newQuestion.question" id="question" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            <p v-if="newQuestion.question.trim() === ''" class="text-red-600 text-sm mt-2">Please fill out this field.</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Options</label>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div v-for="(option, key) in newQuestion.options" :key="key" class="flex flex-col">
                <label :for="key" class="block text-sm font-medium text-gray-700">{{ key }}</label>
                <input v-model="newQuestion.options[key]" :id="key" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                <p v-if="newQuestion.options[key].trim() === ''" class="text-red-600 text-sm mt-2">Please fill out this field.</p>
              </div>
            </div>
            <p v-if="optionsCount < 2" class="text-red-600 text-sm mt-2">You must provide at least 2 options.</p>
          </div>
          <div class="mb-4">
            <label for="correct_option" class="block text-sm font-medium text-gray-700">Correct Option</label>
            <select v-model="newQuestion.correct_option" id="correct_option" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
              <option value="" disabled>Select correct option</option>
              <option v-for="(option, key) in newQuestion.options" :key="key" :value="key">{{ key }}</option>
            </select>
            <p v-if="newQuestion.correct_option === ''" class="text-red-600 text-sm mt-2">Please select an option.</p>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="showModal = false" class="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-2">Cancel</button>
            <button type="submit" class="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Add Question</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg">
      <p>Question added successfully!</p>
    </div>
  </div>
</template>


<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from '@/plugins/axios';

export default {
  name: 'QuizDetails',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const showModal = ref(false);
    const showToast = ref(false);
    const newQuestion = reactive({
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
    const optionsCount = computed(() => {
      return Object.values(newQuestion.options).filter(option => option.trim() !== '').length;
    });
    

    const addQuestion = async () => {
      try {
        if (optionsCount.value < 2) {
          return; // Do not submit if less than 2 options
        }
        await axios.post('http://localhost:8000/api/questions', {
          quiz_id: currentQuiz.value.id,
          ...newQuestion
        });
        showToast.value = true; // Show success toast
        setTimeout(() => {
          showToast.value = false;
          showModal.value = false; // Hide modal
        }, 2000);
        await store.dispatch('quizzes/fetchQuizById', currentQuiz.value.id);
        // Clear form fields
        newQuestion.question = '';
        newQuestion.options = {
          A: '',
          B: '',
          C: '',
          D: ''
        };
        newQuestion.correct_option = '';
      } catch (error) {
        console.error('Failed to add question:', error);
      }
    };

    const toggleDetails = (questionId) => {
      showDetails[questionId] = !showDetails[questionId];
    };

    onMounted(() => {
      store.dispatch('quizzes/fetchQuizById', props.id);
    });

    return {
      showModal,
      showToast,
      newQuestion,
      showDetails,
      questions,
      optionsCount,
      addQuestion,
      toggleDetails,
      currentQuiz
    };
  }
};
</script>



<style scoped>
/* Add any styles you need for this component here */
</style>
