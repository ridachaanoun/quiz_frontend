import { createRouter, createWebHistory } from 'vue-router';

// Import Views and Components
import Home from '@/views/HomeView.vue';
import UserLogin from '@/components/UserLogin.vue';
import UserRegister from '@/components/UserRegister.vue';
import Dashboard from '@/components/Dashboard_.vue';
import QuizDetail from '@/components/QuizDetails.vue';
import ManageCategories from '@/components/ManageCategories.vue';
import ManageQuizzes from '@/components/ManageQuizzes.vue';

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
  {
    path: '/manage-categories',
    component: ManageCategories,
  },
  {
    path: '/manage-quizzes',
    name: 'ManageQuizzes',
    component: ManageQuizzes,
  },
  {
    path: '/quiz/:id',
    name: 'QuizDetails',
    component: QuizDetail,
    props: true,
  },
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
