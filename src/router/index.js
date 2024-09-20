import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Import Views and Components
import Home from '@/views/HomeView.vue';
import UserLogin from '@/components/UserLogin.vue';
import UserRegister from '@/components/UserRegister.vue';
import Dashboard from '@/components/Dashboard_.vue';
import QuizDetailsView from '@/components/QuizDetailsView.vue';
import QuizQuestionView from '@/components/QuizQuestionView.vue';
import QuizResultView from '@/components/QuizResultView.vue';
import UserProfileView from '@/components/UserProfileView.vue';
import UserProfile from '../components/UserProfile.vue'; // Import the new component

// Define Routes
const routes = [
  { path: '/', component: Home, name: 'Home', meta: { requiresAuth: true } },
  { path: '/login', component: UserLogin, meta: { requiresAuth: false } },
  { path: '/register', component: UserRegister, meta: { requiresAuth: false } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  {
    path: '/quiz/:id',
    name: 'QuizDetails',
    component: QuizDetailsView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/:id/question/:questionIndex',
    name: 'QuizQuestionView',
    component: QuizQuestionView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/result',
    name: 'QuizResultView',
    component: QuizResultView,
    props: route => ({ score: Number(route.query.score) }),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'UserProfileView',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true } // Ensure authentication is required for this route
  },
];

// Create Router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Authenticated Routes
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  if (isAuthenticated && !store.state.auth.userData) {
    // Fetch user data if not already set
    await store.dispatch('auth/fetchUserData');
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to /login');
      next('/login');
    } else if (to.meta.requiresAdmin && !isAdmin) {
      console.log('User is not an admin, redirecting to /');
      next('/');
    } else {
      next();  // Proceed if authenticated and has the required role
    }
  } else {
    next();  // Proceed if no authentication is required
  }
});

export default router;
