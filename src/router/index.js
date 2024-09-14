import { createRouter, createWebHistory } from 'vue-router';

// Import Views and Components
import Home from '@/views/HomeView.vue';
import UserLogin from '@/components/UserLogin.vue';
import UserRegister from '@/components/UserRegister.vue';
import Dashboard from '@/components/Dashboard_.vue';
// import QuizDetail from '@/components/QuizDetails.vue'; // Or use QuizDetailsView if that's your choice
// import ManageCategories from '@/components/ManageCategories.vue';
// import ManageQuizzes from '@/components/ManageQuizzes.vue';
import QuizDetailsView from '@/components/QuizDetailsView.vue'; // Ensure only one is used
import QuizQuestionView from '@/components/QuizQuestionView.vue';
import QuizResultView from '@/components/QuizResultView.vue';

// Define Routes
const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
  {
    path: '/login',
    component: UserLogin,
  },
  {
    path: '/register',
    component: UserRegister,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  // {
  //   path: '/manage-categories',
  //   component: ManageCategories,
  // },
  // {
  //   path: '/manage-quizzes',
  //   name: 'ManageQuizzes',
  //   component: ManageQuizzes,
  // },
  {
    path: '/quiz/:id',
    name: 'QuizDetails', // Ensure only one name for the route
    component: QuizDetailsView, // Or QuizDetail based on your choice
    props: true,
  },
  {
    path: '/quiz/:id/question/:questionIndex',
    name: 'QuizQuestionView',
    component: QuizQuestionView,
    props: true,
  },
  {
    path: '/quiz/result',
    name: 'QuizResultView',
    component: QuizResultView,
    props: route => ({ score: Number(route.query.score) }), // Read from query parameters
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
