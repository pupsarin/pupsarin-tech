<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>Settings</h1>
      <p>Manage your account preferences and privacy</p>
    </div>

    <div class="settings-container">
      <!-- Profile Section -->
      <div class="settings-section">
        <h2>Profile Information</h2>
        <div class="settings-card">
          <div class="profile-info">
            <div class="profile-avatar">
              <div class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
            <div class="profile-details">
              <h3>{{ user?.name || 'User Name' }}</h3>
              <p>{{ user?.email || 'user@example.com' }}</p>
              <span class="role-badge">{{ user?.role || 'user' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="settings-section">
        <h2>Notification Preferences</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Email Notifications</h4>
              <p>Receive email updates about new events and updates</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.emailNotifications" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Event Reminders</h4>
              <p>Get reminded about events you're attending</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.eventReminders" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>New Event Alerts</h4>
              <p>Notifications when new events are added near you</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.newEventAlerts" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Weekly Digest</h4>
              <p>Receive a weekly summary of upcoming events</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.weeklyDigest" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="settings-section">
        <h2>Privacy Settings</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Profile Visibility</h4>
              <p>Allow other users to see your profile and RSVP status</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.profileVisible" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Show Attendance</h4>
              <p>Display your attendance status on event pages</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.showAttendance" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Location Sharing</h4>
              <p>Allow the app to use your location for nearby events</p>
            </div>
            <label class="toggle-switch">
              <input v-model="settings.locationSharing" type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Event Preferences -->
      <div class="settings-section">
        <h2>Event Preferences</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Default Categories</h4>
              <p>Categories you're most interested in</p>
            </div>
            <div class="category-selector">
              <label
                v-for="category in categories"
                :key="category"
                class="category-checkbox"
              >
                <input
                  v-model="settings.preferredCategories"
                  type="checkbox"
                  :value="category"
                />
                <span class="checkbox-label">{{ category }}</span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Distance Range</h4>
              <p>Maximum distance for event recommendations (miles)</p>
            </div>
            <div class="range-slider">
              <input
                v-model="settings.distanceRange"
                type="range"
                min="5"
                max="50"
                step="5"
                class="slider"
              />
              <span class="range-value"
                >{{ settings.distanceRange }} miles</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="settings-section">
        <h2>Account Actions</h2>
        <div class="settings-card">
          <div class="action-buttons">
            <button @click="saveSettings" class="btn btn-primary">
              Save Changes
            </button>
            <button @click="resetSettings" class="btn btn-outline">
              Reset to Defaults
            </button>
            <button @click="exportData" class="btn btn-outline">
              Export My Data
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="saveMessage" class="save-message">
        {{ saveMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'SettingsPage',
  setup() {
    const authStore = useAuthStore()
    const saveMessage = ref('')

    const user = computed(() => authStore.user)

    const userInitials = computed(() => {
      if (!user.value?.name) return 'U'
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const categories = [
      'Technology',
      'Arts',
      'Food',
      'Music',
      'Business',
      'Sports',
      'Education'
    ]

    const settings = reactive({
      emailNotifications: true,
      eventReminders: true,
      newEventAlerts: false,
      weeklyDigest: true,
      profileVisible: true,
      showAttendance: true,
      locationSharing: false,
      preferredCategories: ['Technology', 'Arts'],
      distanceRange: 25
    })

    const saveSettings = () => {
      // In a real app, you'd save to backend
      saveMessage.value = 'Settings saved successfully!'
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
    }

    const resetSettings = () => {
      Object.assign(settings, {
        emailNotifications: true,
        eventReminders: true,
        newEventAlerts: false,
        weeklyDigest: true,
        profileVisible: true,
        showAttendance: true,
        locationSharing: false,
        preferredCategories: ['Technology', 'Arts'],
        distanceRange: 25
      })
      saveMessage.value = 'Settings reset to defaults!'
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
    }

    const exportData = () => {
      // Mock data export
      const userData = {
        user: user.value,
        settings: settings,
        timestamp: new Date().toISOString()
      }

      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'eventmap-user-data.json'
      link.click()

      URL.revokeObjectURL(url)
    }

    return {
      user,
      userInitials,
      settings,
      categories,
      saveMessage,
      saveSettings,
      resetSettings,
      exportData
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.settings-card {
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-details h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.profile-details p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.role-badge {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.setting-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.range-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
}

.range-value {
  font-size: 0.875rem;
  color: var(--text-secondary);
  min-width: 80px;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.save-message {
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .range-slider {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
