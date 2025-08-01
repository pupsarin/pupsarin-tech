<template>
  <div class="map-page">
    <div class="page-header">
      <h1>Event Map</h1>
      <p>Discover and explore events happening around you</p>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-row">
        <div class="form-group">
          <label class="form-label">Date Range</label>
          <select v-model="selectedDateRange" class="form-input">
            <option value="all">All Events</option>
            <option value="past-week">Past Week</option>
            <option value="past-two-weeks">Past Two Weeks</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="next-week">Next Week</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select v-model="selectedCategory" class="form-input">
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Arts">Arts</option>
            <option value="Food">Food</option>
            <option value="Music">Music</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Layer</label>
          <select v-model="selectedLayer" class="form-input">
            <option value="all">All Events</option>
            <option value="past">Past Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="today">Today's Events</option>
          </select>
        </div>

        <button @click="clearFilters" class="btn btn-outline">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-container">
      <div id="map" style="height: 100%; width: 100%;"></div>
    </div>

    <!-- Events List -->
    <div class="events-section">
      <h2>Events ({{ filteredEvents.length }})</h2>
      <div class="events-grid">
        <div 
          v-for="event in filteredEvents" 
          :key="event.id" 
          class="event-card"
          @click="selectEvent(event)"
        >
          <div class="event-header">
            <h3 class="event-title">{{ event.title }}</h3>
            <span class="event-category">{{ event.category }}</span>
          </div>
          <div class="event-meta">
            <span>📅 {{ formatDate(event.date) }}</span>
            <span>🕒 {{ event.time }}</span>
            <span>📍 {{ event.location.name }}</span>
          </div>
          <p class="event-description">{{ event.description }}</p>
          <div class="event-footer">
            <span class="attendees">👥 {{ event.attendees }}/{{ event.maxAttendees }} attending</span>
            <router-link :to="`/event/${event.id}`" class="btn btn-primary">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useEventsStore } from '../stores/events'
import { format, subDays, addDays, startOfDay, endOfDay } from 'date-fns'

export default {
  name: 'MapPage',
  setup() {
    const eventsStore = useEventsStore()
    
    const selectedDateRange = ref('all')
    const selectedCategory = ref('')
    const selectedLayer = ref('all')
    const map = ref(null)
    const markers = ref([])

    const filteredEvents = computed(() => {
      let events = eventsStore.events

      // Filter by date range
      if (selectedDateRange.value !== 'all') {
        const today = new Date()
        switch (selectedDateRange.value) {
          case 'past-week':
            events = events.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= subDays(today, 7) && eventDate < today
            })
            break
          case 'past-two-weeks':
            events = events.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= subDays(today, 14) && eventDate < today
            })
            break
          case 'upcoming':
            events = events.filter(event => new Date(event.date) >= today)
            break
          case 'next-week':
            events = events.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= today && eventDate <= addDays(today, 7)
            })
            break
          case 'next-month':
            events = events.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= today && eventDate <= addDays(today, 30)
            })
            break
        }
      }

      // Filter by category
      if (selectedCategory.value) {
        events = events.filter(event => event.category === selectedCategory.value)
      }

      // Filter by layer
      if (selectedLayer.value !== 'all') {
        const today = new Date()
        switch (selectedLayer.value) {
          case 'past':
            events = events.filter(event => new Date(event.date) < today)
            break
          case 'upcoming':
            events = events.filter(event => new Date(event.date) >= today)
            break
          case 'today':
            events = events.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= startOfDay(today) && eventDate <= endOfDay(today)
            })
            break
        }
      }

      return events
    })

    const formatDate = (dateString) => {
      return format(new Date(dateString), 'MMM dd, yyyy')
    }

    const clearFilters = () => {
      selectedDateRange.value = 'all'
      selectedCategory.value = ''
      selectedLayer.value = 'all'
    }

    const selectEvent = (event) => {
      // Center map on selected event
      if (map.value) {
        map.value.setView([event.location.lat, event.location.lng], 15)
      }
    }

    const initMap = () => {
      // Mock map initialization (in real app, you'd use Leaflet or similar)
      const mapContainer = document.getElementById('map')
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="
            height: 100%; 
            width: 100%; 
            background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 1.2rem;
          ">
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
              <div>Interactive Map View</div>
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">
                {{ filteredEvents.length }} events displayed
              </div>
            </div>
          </div>
        `
      }
    }

    const updateMapMarkers = () => {
      // Clear existing markers
      markers.value = []
      
      // Add new markers for filtered events
      filteredEvents.value.forEach(event => {
        markers.value.push({
          id: event.id,
          lat: event.location.lat,
          lng: event.location.lng,
          title: event.title
        })
      })
    }

    onMounted(() => {
      initMap()
      updateMapMarkers()
    })

    watch(filteredEvents, () => {
      updateMapMarkers()
      initMap()
    })

    return {
      selectedDateRange,
      selectedCategory,
      selectedLayer,
      filteredEvents,
      formatDate,
      clearFilters,
      selectEvent
    }
  }
}
</script>

<style scoped>
.map-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.events-section {
  margin-top: 2rem;
}

.events-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.event-category {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.attendees {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style> 