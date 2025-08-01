<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <router-link to="/" class="navbar-brand"> EventMap </router-link>
          <ul class="navbar-nav">
            <li>
              <router-link to="/" class="nav-link" active-class="active">
                Map
              </router-link>
            </li>
            <li v-if="isAuthenticated">
              <router-link
                to="/settings"
                class="nav-link"
                active-class="active"
              >
                Settings
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/create-event"
                class="nav-link"
                active-class="active"
              >
                Create Event
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/dashboard"
                class="nav-link"
                active-class="active"
              >
                Dashboard
              </router-link>
            </li>
            <li v-if="!isAuthenticated">
              <router-link to="/auth" class="nav-link" active-class="active">
                Login
              </router-link>
            </li>
            <li v-else>
              <button @click="logout" class="btn btn-outline">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)

    const logout = () => {
      authStore.logout()
    }

    return {
      isAuthenticated,
      isAdmin,
      logout
    }
  }
}
</script>
