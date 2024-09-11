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

// Define Routes
const routes = [
  {
    path: '/',
    component: Home,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
