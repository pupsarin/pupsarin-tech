<template>
  <div class="event-details-page">
    <div v-if="event" class="event-container">
      <!-- Event Header -->
      <div class="event-header">
        <div class="event-title-section">
          <h1>{{ event.title }}</h1>
          <span class="event-category">{{ event.category }}</span>
        </div>
        <div class="event-actions">
          <router-link to="/" class="btn btn-outline">
            ← Back to Map
          </router-link>
        </div>
      </div>

      <div class="event-content">
        <!-- Event Info -->
        <div class="event-info-card">
          <div class="event-meta-grid">
            <div class="meta-item">
              <div class="meta-icon">📅</div>
              <div class="meta-content">
                <div class="meta-label">Date</div>
                <div class="meta-value">{{ formatDate(event.date) }}</div>
              </div>
            </div>
            
            <div class="meta-item">
              <div class="meta-icon">🕒</div>
              <div class="meta-content">
                <div class="meta-label">Time</div>
                <div class="meta-value">{{ event.time }}</div>
              </div>
            </div>
            
            <div class="meta-item">
              <div class="meta-icon">📍</div>
              <div class="meta-content">
                <div class="meta-label">Location</div>
                <div class="meta-value">{{ event.location.name }}</div>
              </div>
            </div>
            
            <div class="meta-item">
              <div class="meta-icon">👥</div>
              <div class="meta-content">
                <div class="meta-label">Attendees</div>
                <div class="meta-value">{{ event.attendees }}/{{ event.maxAttendees }}</div>
              </div>
            </div>
          </div>

          <div class="event-description">
            <h3>About this event</h3>
            <p>{{ event.description }}</p>
          </div>

          <!-- RSVP Section -->
          <div class="rsvp-section">
            <h3>Are you attending?</h3>
            <div class="rsvp-buttons">
              <button 
                @click="rsvp('attending')" 
                :class="['btn', 'rsvp-btn', { 'active': userRSVP === 'attending' }]"
              >
                ✅ I'm attending
              </button>
              <button 
                @click="rsvp('interested')" 
                :class="['btn', 'rsvp-btn', { 'active': userRSVP === 'interested' }]"
              >
                🤔 I'm interested
              </button>
              <button 
                @click="rsvp('not-attending')" 
                :class="['btn', 'rsvp-btn', { 'active': userRSVP === 'not-attending' }]"
              >
                ❌ Not attending
              </button>
            </div>
            <div v-if="rsvpMessage" class="rsvp-message">
              {{ rsvpMessage }}
            </div>
          </div>
        </div>

        <!-- Map Section -->
        <div class="map-section">
          <h3>Event Location</h3>
          <div class="map-container">
            <EventMap 
              :events="[event]" 
              :center="event.location" 
              :zoom="15"
              :show-controls="false"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Event not found</h2>
      <p>The event you're looking for doesn't exist or has been removed.</p>
      <router-link to="/" class="btn btn-primary">
        Back to Map
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { format } from 'date-fns'
import EventMap from '../components/EventMap.vue'

export default {
  name: 'EventDetailsPage',
  components: {
    EventMap
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const eventsStore = useEventsStore()
    
    const rsvpMessage = ref('')
    
    const event = computed(() => {
      const eventId = parseInt(props.id)
      return eventsStore.getEventById(eventId)
    })
    
    const userRSVP = computed(() => {
      return eventsStore.getUserRSVP(parseInt(props.id))
    })

    const formatDate = (dateString) => {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy')
    }

    const rsvp = (status) => {
      eventsStore.rsvpToEvent(parseInt(props.id), status)
      
      // Show confirmation message
      switch (status) {
        case 'attending':
          rsvpMessage.value = 'Great! You\'re attending this event.'
          break
        case 'interested':
          rsvpMessage.value = 'Thanks for your interest! We\'ll keep you updated.'
          break
        case 'not-attending':
          rsvpMessage.value = 'No problem! Thanks for letting us know.'
          break
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        rsvpMessage.value = ''
      }, 3000)
    }

    onMounted(() => {
      // Initialize map if needed
      const mapContainer = document.getElementById('event-map')
      if (mapContainer && event.value) {
        // In a real app, you'd initialize a proper map here
        console.log('Map initialized for event:', event.value.title)
      }
    })

    return {
      event,
      userRSVP,
      rsvpMessage,
      formatDate,
      rsvp
    }
  }
}
</script>

<style scoped>
.event-details-page {
  padding: 2rem 0;
}

.event-container {
  max-width: 1000px;
  margin: 0 auto;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.event-title-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.event-category {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.event-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.event-info-card {
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 2rem;
}

.event-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.meta-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.meta-value {
  font-weight: 600;
  color: var(--text-primary);
}

.event-description {
  margin-bottom: 2rem;
}

.event-description h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.event-description p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.rsvp-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.rsvp-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.rsvp-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.rsvp-btn {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.rsvp-btn:hover {
  background-color: var(--bg-secondary);
}

.rsvp-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.rsvp-message {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
}

.map-section {
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  height: fit-content;
}

.map-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .event-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .event-title-section h1 {
    font-size: 2rem;
  }
  
  .event-content {
    grid-template-columns: 1fr;
  }
  
  .event-meta-grid {
    grid-template-columns: 1fr;
  }
  
  .rsvp-buttons {
    flex-direction: column;
  }
  
  .rsvp-btn {
    min-width: auto;
  }
}
</style> 