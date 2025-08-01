import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })

  const login = (email, password) => {
    // Mock authentication logic
    if (email === 'admin@example.com' && password === 'admin123') {
      user.value = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      }
      isAuthenticated.value = true
      return { success: true }
    } else if (email === 'user@example.com' && password === 'user123') {
      user.value = {
        id: 2,
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user'
      }
      isAuthenticated.value = true
      return { success: true }
    } else {
      return { success: false, error: 'Invalid credentials' }
    }
  }

  const signup = (name, email, password, role = 'user') => {
    // Mock signup logic
    user.value = {
      id: Date.now(),
      email,
      name,
      role
    }
    isAuthenticated.value = true
    return { success: true }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout
  }
}) 