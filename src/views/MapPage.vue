<template>
  <div class="map-page">
    <div class="page-header">
      <h1>Event Map</h1>
      <p>Discover and explore events happening around you</p>
    </div>

    <!-- Category Filter -->
    <div class="filter-bar">
      <div class="filter-row">
        <div class="form-group">
          <label class="form-label">Filter by Category</label>
          <select v-model="selectedCategory" class="form-input">
            <option value="">All Categories</option>
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

        <button @click="clearFilters" class="btn btn-outline">
          Clear Filter
        </button>
      </div>
    </div>

    <!-- Map Container with Time Navigator Overlay -->
    <div class="map-container">
      <EventMap
        :events="filteredEvents"
        :center="{ lat: 40.7128, lng: -74.006 }"
        :zoom="12"
        :current-week="currentWeek"
        @event-click="handleEventClick"
      />

      <!-- Compact Time Navigator Overlay -->
      <div class="time-navigator-overlay">
        <TimeNavigator
          :events="eventsStore.events"
          :initial-week-index="currentWeekIndex"
          :compact="true"
          @week-change="handleWeekChange"
          @event-click="handleEventClick"
        />
      </div>
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
            <span class="attendees"
              >👥 {{ event.attendees }}/{{ event.maxAttendees }} attending</span
            >
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import {
  format,
  isWithinInterval,
  parseISO
} from 'date-fns'
import EventMap from '../components/EventMap.vue'
import TimeNavigator from '../components/TimeNavigator.vue'

export default {
  name: 'MapPage',
  components: {
    EventMap,
    TimeNavigator
  },
  setup() {
    const router = useRouter()
    const eventsStore = useEventsStore()

    const selectedCategory = ref('')
    const currentWeekIndex = ref(0)
    const currentWeek = ref(null)

    const filteredEvents = computed(() => {
      let events = eventsStore.events

      // Filter by current week from TimeNavigator
      if (currentWeek.value) {
        events = events.filter(event => {
          const eventDate = parseISO(event.date)
          return isWithinInterval(eventDate, {
            start: currentWeek.value.start,
            end: currentWeek.value.end
          })
        })
      }

      // Filter by category
      if (selectedCategory.value) {
        events = events.filter(
          event => event.category === selectedCategory.value
        )
      }

      return events
    })

    const formatDate = dateString => {
      return format(new Date(dateString), 'MMM dd, yyyy')
    }

    const handleWeekChange = weekData => {
      currentWeekIndex.value = weekData.weekIndex
      currentWeek.value = weekData.week
    }

    const handleEventClick = event => {
      router.push(`/event/${event.id}`)
    }

    const clearFilters = () => {
      selectedCategory.value = ''
      currentWeek.value = null
      currentWeekIndex.value = 0
    }



    return {
      eventsStore,
      selectedCategory,
      currentWeekIndex,
      currentWeek,
      filteredEvents,
      formatDate,
      clearFilters,
      handleEventClick,
      handleWeekChange
    }
  }
}
</script>

<style scoped>
.map-page {
  padding: 1rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  text-align: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.filter-bar {
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.map-container {
  position: relative;
  flex: 1;
  height: 70vh;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  display: block;
}

.time-navigator-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  max-width: 400px;
}

.events-section {
  margin-top: 1rem;
  flex-shrink: 0;
}

.events-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
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
  .map-page {
    padding: 0.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .map-container {
    height: 60vh;
    min-height: 400px;
  }

  .time-navigator-overlay {
    top: 10px;
    left: 10px;
    right: 10px;
    padding: 0.75rem;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
