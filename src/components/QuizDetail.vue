<template>
  <div v-if="quiz" class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ quiz.title }}</h1>
    <p class="mb-4"><strong>Category:</strong> {{ categoryName }}</p>
    <p class="mb-4"><strong>Description:</strong> {{ quiz.description }}</p>
    <img v-if="quiz.image" :src="`http://127.0.0.1:8000/storage/${quiz.image}`" alt="Quiz Image" class="w-full h-auto mt-4" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      quizId: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters('quizzes', ['currentQuiz']),
    ...mapGetters('categories', ['categories']),
    quiz() {
      return this.currentQuiz;
    },
    categoryName() {
      const category = this.categories.find(cat => cat.id === this.quiz.category_id);
      return category ? category.name : 'Unknown';
    },
  },
  async created() {
    await this.fetchQuiz(this.quizId);
    await this.fetchCategories();
  },
  methods: {
    ...mapActions('quizzes', ['fetchQuiz']),
    ...mapActions('categories', ['fetchCategories']),
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
