import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  {
    path: '/categories',
    name: 'CreateCategory',
    component: () => import('../components/categories_.vue'),
    meta: {
      requiresAuth: true,
      isAdmin: true,
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

