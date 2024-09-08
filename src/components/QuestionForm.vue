<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <!-- Close Button -->
        <button @click="close" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="text-xl font-semibold mb-4">{{ isUpdate ? 'Update Question' : 'Add a New Question' }}</h2>
        <form @submit.prevent="submit">
          <!-- Question Form Fields -->
          <div class="mb-4">
            <label for="question" class="block text-sm font-medium text-gray-700">Question</label>
            <input type="text" id="question" v-model="localQuestion.question" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Options</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="optionA" class="block text-sm font-medium text-gray-700">Option A</label>
                <input type="text" id="optionA" v-model="localQuestion.options.A" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required />
              </div>
              <div>
                <label for="optionB" class="block text-sm font-medium text-gray-700">Option B</label>
                <input type="text" id="optionB" v-model="localQuestion.options.B" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required />
              </div>
              <div>
                <label for="optionC" class="block text-sm font-medium text-gray-700">Option C</label>
                <input type="text" id="optionC" v-model="localQuestion.options.C" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required />
              </div>
              <div>
                <label for="optionD" class="block text-sm font-medium text-gray-700">Option D</label>
                <input type="text" id="optionD" v-model="localQuestion.options.D" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required />
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label for="correct_option" class="block text-sm font-medium text-gray-700">Correct Option</label>
            <select id="correct_option" v-model="localQuestion.correct_option" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" required>
              <option value="" disabled>Select correct option</option>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">{{ isUpdate ? 'Update Question' : 'Add Question' }}</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    name: 'QuestionForm',
    props: {
      isUpdate: {
        type: Boolean,
        required: true
      },
      question: {
        type: Object,
        required: true
      }
    },
    setup(props, { emit }) {
      const localQuestion = ref({ ...props.question });
  
      const close = () => {
        emit('close');
      };
  
      const submit = () => {
        emit('submit', localQuestion.value);
      };
  
      watch(() => props.question, (newVal) => {
        localQuestion.value = { ...newVal };
      });
  
      return {
        localQuestion,
        close,
        submit
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  