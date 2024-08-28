import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import Dashboard from '../components/Dashboard_.vue';
import QuizDetail from '@/components/QuizDetail.vue'; // Import the new component

import ManageCategories from '@/components/ManageCategories.vue';
import ManageQuizzes from '@/components/ManageQuizzes.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/Dashboard', component: Dashboard},
  { path: '/ManageCategories', component:ManageCategories},
  { path: '/ManageQuizzes', component: ManageQuizzes},
  {
    path: '/quiz/:id',
    name: 'QuizDetail',
    component: QuizDetail,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

