<template>
  <div class="create-event-page">
    <div class="page-header">
      <h1>Create New Event</h1>
      <p>Add a new event to the map</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="event-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Event Title *</label>
            <input 
              v-model="form.title" 
              type="text" 
              class="form-input" 
              placeholder="Enter event title"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Category *</label>
            <select v-model="form.category" class="form-input" required>
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Arts">Arts</option>
              <option value="Food">Food</option>
              <option value="Music">Music</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description *</label>
          <textarea 
            v-model="form.description" 
            class="form-input" 
            rows="4"
            placeholder="Describe your event..."
            required
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date *</label>
            <input 
              v-model="form.date" 
              type="date" 
              class="form-input" 
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Time *</label>
            <input 
              v-model="form.time" 
              type="time" 
              class="form-input" 
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Location Name *</label>
            <input 
              v-model="form.locationName" 
              type="text" 
              class="form-input" 
              placeholder="Enter location name"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Max Attendees</label>
            <input 
              v-model="form.maxAttendees" 
              type="number" 
              class="form-input" 
              placeholder="100"
              min="1"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Location Coordinates</label>
          <div class="coordinates-input">
            <input 
              v-model="form.lat" 
              type="number" 
              class="form-input" 
              placeholder="Latitude (e.g., 40.7128)"
              step="0.0001"
            />
            <input 
              v-model="form.lng" 
              type="number" 
              class="form-input" 
              placeholder="Longitude (e.g., -74.0060)"
              step="0.0001"
            />
          </div>
          <p class="form-help">Or click on the map below to set location</p>
        </div>

        <!-- Map for location picker -->
        <LocationPicker 
          :initial-location="{ lat: 40.7128, lng: -74.0060 }"
          @location-selected="handleLocationSelected"
          @location-cleared="handleLocationCleared"
        />

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-outline">
            Reset Form
          </button>
          <button type="submit" class="btn btn-primary">
            Create Event
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import LocationPicker from '../components/LocationPicker.vue'

export default {
  name: 'CreateEventPage',
  components: {
    LocationPicker
  },
  setup() {
    const router = useRouter()
    const eventsStore = useEventsStore()
    
    const error = ref('')
    
    const form = reactive({
      title: '',
      description: '',
      date: '',
      time: '',
      category: '',
      locationName: '',
      lat: '',
      lng: '',
      maxAttendees: 100
    })

    const handleSubmit = async () => {
      error.value = ''
      
      try {
        // Validate required fields
        if (!form.title || !form.description || !form.date || !form.time || !form.category || !form.locationName) {
          error.value = 'Please fill in all required fields'
          return
        }

        // Validate coordinates
        if (!form.lat || !form.lng) {
          error.value = 'Please set the event location on the map'
          return
        }

        const eventData = {
          title: form.title,
          description: form.description,
          date: form.date,
          time: form.time,
          category: form.category,
          location: {
            name: form.locationName,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng)
          },
          maxAttendees: parseInt(form.maxAttendees) || 100
        }

        const newEvent = eventsStore.addEvent(eventData)
        
        // Redirect to the new event details page
        router.push(`/event/${newEvent.id}`)
      } catch (err) {
        error.value = 'Failed to create event. Please try again.'
      }
    }

    const handleLocationSelected = (location) => {
      form.lat = location.lat.toString()
      form.lng = location.lng.toString()
      form.locationName = location.address || `Location at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
    }

    const handleLocationCleared = () => {
      form.lat = ''
      form.lng = ''
      form.locationName = ''
    }

    const resetForm = () => {
      Object.assign(form, {
        title: '',
        description: '',
        date: '',
        time: '',
        category: '',
        locationName: '',
        lat: '',
        lng: '',
        maxAttendees: 100
      })
      error.value = ''
    }

    return {
      form,
      error,
      handleSubmit,
      resetForm,
      handleLocationSelected,
      handleLocationCleared
    }
  }
}
</script>

<style scoped>
.create-event-page {
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

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.event-form {
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinates-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-help {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.error-message {
  background-color: #fef2f2;
  color: var(--danger-color);
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .coordinates-input {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .event-form {
    padding: 1.5rem;
  }
}
</style> 