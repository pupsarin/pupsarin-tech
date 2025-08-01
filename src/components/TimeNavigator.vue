<template>
  <div class="time-navigator" :class="{ compact: compact }">
    <!-- Compact Version -->
    <div v-if="compact" class="compact-navigator">
      <div class="compact-header">
        <div class="current-week-compact">
          <span class="week-date-compact">{{ currentWeekLabel }}</span>
          <span class="event-count-compact">{{ currentWeekEvents.length }} events</span>
        </div>
      </div>
      
      <div class="compact-controls">
        <button 
          @click="previousWeek" 
          class="nav-btn-compact"
          :disabled="currentWeekIndex === 0"
        >
          ←
        </button>
        
        <div class="slider-container-compact">
          <input 
            v-model="currentWeekIndex" 
            type="range" 
            :min="0" 
            :max="totalWeeks - 1" 
            step="1"
            class="week-range-slider-compact"
            @input="handleWeekChange"
          />
        </div>
        
        <button 
          @click="nextWeek" 
          class="nav-btn-compact"
          :disabled="currentWeekIndex === totalWeeks - 1"
        >
          →
        </button>
      </div>
    </div>
    
    <!-- Full Version -->
    <div v-else>
      <div class="time-header">
        <h3>Time Navigation</h3>
        <div class="current-week">
          <span class="week-label">Current Week:</span>
          <span class="week-date">{{ currentWeekLabel }}</span>
        </div>
      </div>
      
      <div class="time-controls">
        <div class="week-slider">
          <div class="slider-labels">
            <span class="slider-label">{{ firstWeekLabel }}</span>
            <span class="slider-label">{{ lastWeekLabel }}</span>
          </div>
          
          <div class="slider-container">
            <input 
              v-model="currentWeekIndex" 
              type="range" 
              :min="0" 
              :max="totalWeeks - 1" 
              step="1"
              class="week-range-slider"
              @input="handleWeekChange"
            />
            
            <div class="week-markers">
              <div 
                v-for="(week, index) in weekMarkers" 
                :key="index"
                class="week-marker"
                :class="{ active: index === currentWeekIndex }"
                @click="setWeek(index)"
              >
                <div class="marker-dot"></div>
                <div class="marker-label">{{ week.label }}</div>
                <div class="event-count">{{ week.eventCount }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="week-navigation">
          <button 
            @click="previousWeek" 
            class="nav-btn"
            :disabled="currentWeekIndex === 0"
          >
            ← Previous Week
          </button>
          
          <button 
            @click="nextWeek" 
            class="nav-btn"
            :disabled="currentWeekIndex === totalWeeks - 1"
          >
            Next Week →
          </button>
        </div>
      </div>
      
      <div class="week-summary">
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Events this week:</span>
            <span class="stat-value">{{ currentWeekEvents.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Date range:</span>
            <span class="stat-value">{{ currentWeekRange }}</span>
          </div>
        </div>
        
        <div class="week-events-preview">
          <h4>This Week's Events</h4>
          <div class="events-list">
            <div 
              v-for="event in currentWeekEvents" 
              :key="event.id"
              class="event-preview"
              @click="$emit('event-click', event)"
            >
              <div class="event-day">{{ formatDay(event.date) }}</div>
              <div class="event-info">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-time">{{ event.time }}</div>
              </div>
              <div class="event-category">{{ event.category }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek, parseISO } from 'date-fns'

export default {
  name: 'TimeNavigator',
  props: {
    events: {
      type: Array,
      default: () => []
    },
    initialWeekIndex: {
      type: Number,
      default: 0
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['week-change', 'event-click'],
  setup(props, { emit }) {
    const currentWeekIndex = ref(props.initialWeekIndex)
    
    // Calculate all weeks that contain events
    const allWeeks = computed(() => {
      const weekMap = new Map()
      
      props.events.forEach(event => {
        const eventDate = parseISO(event.date)
        const weekStart = startOfWeek(eventDate, { weekStartsOn: 1 }) // Monday start
        const weekKey = format(weekStart, 'yyyy-MM-dd')
        
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, {
            start: weekStart,
            end: endOfWeek(eventDate, { weekStartsOn: 1 }),
            events: []
          })
        }
        weekMap.get(weekKey).events.push(event)
      })
      
      // Sort weeks by date
      return Array.from(weekMap.values()).sort((a, b) => a.start - b.start)
    })
    
    const totalWeeks = computed(() => allWeeks.value.length)
    
    // Create week markers for the slider
    const weekMarkers = computed(() => {
      return allWeeks.value.map((week, index) => ({
        index,
        label: format(week.start, 'MMM dd'),
        eventCount: week.events.length,
        start: week.start,
        end: week.end
      }))
    })
    
    // Current week data
    const currentWeek = computed(() => {
      if (allWeeks.value.length === 0) return null
      return allWeeks.value[currentWeekIndex.value] || allWeeks.value[0]
    })
    
    const currentWeekEvents = computed(() => {
      return currentWeek.value?.events || []
    })
    
    const currentWeekLabel = computed(() => {
      if (!currentWeek.value) return 'No events'
      return `${format(currentWeek.value.start, 'MMM dd')} - ${format(currentWeek.value.end, 'MMM dd, yyyy')}`
    })
    
    const currentWeekRange = computed(() => {
      if (!currentWeek.value) return 'No events'
      return `${format(currentWeek.value.start, 'MMM dd')} - ${format(currentWeek.value.end, 'MMM dd')}`
    })
    
    const firstWeekLabel = computed(() => {
      if (weekMarkers.value.length === 0) return ''
      return weekMarkers.value[0].label
    })
    
    const lastWeekLabel = computed(() => {
      if (weekMarkers.value.length === 0) return ''
      return weekMarkers.value[weekMarkers.value.length - 1].label
    })
    
    // Navigation methods
    const handleWeekChange = () => {
      emit('week-change', {
        weekIndex: currentWeekIndex.value,
        week: currentWeek.value,
        events: currentWeekEvents.value
      })
    }
    
    const setWeek = (index) => {
      currentWeekIndex.value = index
      handleWeekChange()
    }
    
    const previousWeek = () => {
      if (currentWeekIndex.value > 0) {
        currentWeekIndex.value--
        handleWeekChange()
      }
    }
    
    const nextWeek = () => {
      if (currentWeekIndex.value < totalWeeks.value - 1) {
        currentWeekIndex.value++
        handleWeekChange()
      }
    }
    
    // Helper methods
    const formatDay = (dateString) => {
      return format(parseISO(dateString), 'EEE')
    }
    
    // Watch for events changes and adjust current week if needed
    watch(() => props.events, () => {
      if (currentWeekIndex.value >= totalWeeks.value) {
        currentWeekIndex.value = Math.max(0, totalWeeks.value - 1)
      }
    })
    
    return {
      currentWeekIndex,
      totalWeeks,
      weekMarkers,
      currentWeekEvents,
      currentWeekLabel,
      currentWeekRange,
      firstWeekLabel,
      lastWeekLabel,
      handleWeekChange,
      setWeek,
      previousWeek,
      nextWeek,
      formatDay
    }
  }
}
</script>

<style scoped>
.time-navigator {
  background: white;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.time-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.time-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.current-week {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.week-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.week-date {
  font-weight: 600;
  color: var(--primary-color);
}

.time-controls {
  margin-bottom: 1.5rem;
}

.week-slider {
  margin-bottom: 1rem;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.slider-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.slider-container {
  position: relative;
  padding: 1rem 0;
}

.week-range-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
  margin-bottom: 2rem;
}

.week-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.week-range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.week-markers {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: -1rem;
}

.week-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.week-marker:hover {
  background: var(--bg-secondary);
}

.week-marker.active {
  background: var(--primary-color);
  color: white;
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  margin-bottom: 0.25rem;
}

.week-marker.active .marker-dot {
  background: white;
}

.marker-label {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
}

.event-count {
  font-size: 0.625rem;
  opacity: 0.8;
}

.week-navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.week-summary {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.summary-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--text-primary);
}

.week-events-preview h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.event-preview:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.event-day {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.875rem;
  min-width: 40px;
}

.event-info {
  flex: 1;
}

.event-title {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.125rem;
}

.event-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.event-category {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Compact Version Styles */
.time-navigator.compact {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.compact-navigator {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: var(--shadow-lg);
}

.compact-header {
  margin-bottom: 0.75rem;
}

.current-week-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.week-date-compact {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.event-count-compact {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.compact-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn-compact {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.nav-btn-compact:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.nav-btn-compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-container-compact {
  flex: 1;
  position: relative;
}

.week-range-slider-compact {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.week-range-slider-compact::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.week-range-slider-compact::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .time-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .week-navigation {
    flex-direction: column;
  }
  
  .event-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 