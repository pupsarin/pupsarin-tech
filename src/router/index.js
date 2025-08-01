import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import components
import MapPage from '../views/MapPage.vue'
import AuthPage from '../views/AuthPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import CreateEventPage from '../views/CreateEventPage.vue'
import EventDetailsPage from '../views/EventDetailsPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'Map',
    component: MapPage
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-event',
    name: 'CreateEvent',
    component: CreateEventPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/event/:id',
    name: 'EventDetails',
    component: EventDetailsPage,
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/pupsarin-tech/' : '/'),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
