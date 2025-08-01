<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>{{ isLogin ? 'Welcome Back' : 'Join EventMap' }}</h1>
          <p>{{ isLogin ? 'Sign in to your account' : 'Create your account to get started' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Full Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="form-input" 
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="form-input" 
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="form-input" 
              placeholder="Enter your password"
              required
            />
          </div>

          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-input">
              <option value="user">Regular User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary auth-submit">
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button @click="toggleMode" class="link-button">
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>

        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="demo-account">
            <strong>Admin:</strong> admin@example.com / admin123
          </div>
          <div class="demo-account">
            <strong>User:</strong> user@example.com / user123
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AuthPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLogin = ref(true)
    const error = ref('')
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      role: 'user'
    })

    const handleSubmit = async () => {
      error.value = ''
      
      try {
        let result
        if (isLogin.value) {
          result = authStore.login(form.email, form.password)
        } else {
          result = authStore.signup(form.name, form.email, form.password, form.role)
        }
        
        if (result.success) {
          router.push('/')
        } else {
          error.value = result.error || 'Authentication failed'
        }
      } catch (err) {
        error.value = 'An error occurred. Please try again.'
      }
    }

    const toggleMode = () => {
      isLogin.value = !isLogin.value
      error.value = ''
      // Reset form
      form.name = ''
      form.email = ''
      form.password = ''
      form.role = 'user'
    }

    return {
      isLogin,
      form,
      error,
      handleSubmit,
      toggleMode
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background-color: var(--bg-primary);
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-secondary);
}

.auth-form {
  margin-bottom: 1.5rem;
}

.auth-submit {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.auth-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.link-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

.link-button:hover {
  color: var(--primary-dark);
}

.error-message {
  background-color: #fef2f2;
  color: var(--danger-color);
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.demo-accounts {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.demo-accounts h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.demo-account {
  background-color: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
}
</style> 