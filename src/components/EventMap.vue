<template>
  <div class="event-map-container">
    <div id="map" ref="mapContainer" class="map-container"></div>
    
    <!-- Map Controls -->
    <div v-if="showControls" class="map-controls">
      <div class="layer-control">
        <h4>Map Style</h4>
        <div class="layer-buttons">
          <button 
            @click="setBaseLayer('streets')" 
            :class="['layer-btn', { active: currentBaseLayer === 'streets' }]"
          >
            Streets
          </button>
          <button 
            @click="setBaseLayer('satellite')" 
            :class="['layer-btn', { active: currentBaseLayer === 'satellite' }]"
          >
            Satellite
          </button>
          <button 
            @click="setBaseLayer('terrain')" 
            :class="['layer-btn', { active: currentBaseLayer === 'terrain' }]"
          >
            Terrain
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'EventMap',
  props: {
    events: {
      type: Array,
      default: () => []
    },
    center: {
      type: Object,
      default: () => ({ lat: 40.7128, lng: -74.0060 })
    },
    zoom: {
      type: Number,
      default: 12
    },
    showControls: {
      type: Boolean,
      default: true
    },
    currentWeek: {
      type: Object,
      default: null
    }
  },
  emits: ['event-click'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    const map = ref(null)
    const currentBaseLayer = ref('streets')
    
    // Layer groups
    const eventLayer = ref(null)
    
    // Base layers
    const baseLayers = ref({})
    const currentLayer = ref(null)
    
    // Week-based event count
    const weekEventsCount = computed(() => {
      if (!props.currentWeek) return 0
      return props.events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= props.currentWeek.start && eventDate <= props.currentWeek.end
      }).length
    })
    
    // Initialize map
    const initMap = () => {
      if (!mapContainer.value) return
      
      // Create map instance
      map.value = L.map(mapContainer.value, {
        center: [props.center.lat, props.center.lng],
        zoom: props.zoom,
        zoomControl: true,
        attributionControl: true
      })
      
      // Initialize base layers
      initBaseLayers()
      
      // Initialize event layer
      initEventLayer()
      
      // Set initial base layer
      setBaseLayer('streets')
    }
    
    // Initialize base map layers
    const initBaseLayers = () => {
      baseLayers.value = {
        'Streets': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        }),
        'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenTopoMap'
        })
      }
    }
    
    // Initialize event layer
    const initEventLayer = () => {
      eventLayer.value = L.layerGroup()
      map.value.addLayer(eventLayer.value)
    }
    
    // Set base layer
    const setBaseLayer = (layerType) => {
      if (currentLayer.value) {
        map.value.removeLayer(currentLayer.value)
      }
      
      currentBaseLayer.value = layerType
      currentLayer.value = baseLayers.value[layerType === 'streets' ? 'Streets' : 
                                          layerType === 'satellite' ? 'Satellite' : 'Terrain']
      currentLayer.value.addTo(map.value)
    }
    

    
    // Create event marker
    const createEventMarker = (event) => {
      const isUpcoming = new Date(event.date) > new Date()
      const isToday = new Date(event.date).toDateString() === new Date().toDateString()
      
      // Choose icon based on event type and status
      let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
      
      if (isToday) {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      } else if (isUpcoming) {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
      } else {
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'
      }
      
      const icon = L.icon({
        iconUrl: iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      
      const marker = L.marker([event.location.lat, event.location.lng], { icon })
      
      // Create popup content
      const popupContent = `
        <div class="event-popup">
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location.name}</p>
          <p><strong>Attendees:</strong> ${event.attendees}/${event.maxAttendees}</p>
          <button onclick="window.dispatchEvent(new CustomEvent('event-click', {detail: ${event.id}}))">
            View Details
          </button>
        </div>
      `
      
      marker.bindPopup(popupContent)
      
      // Add click handler
      marker.on('click', () => {
        emit('event-click', event)
      })
      
      return marker
    }
    
    // Update event markers
    const updateEventMarkers = () => {
      // Clear existing markers
      eventLayer.value.clearLayers()
      
      props.events.forEach(event => {
        const marker = createEventMarker(event)
        eventLayer.value.addLayer(marker)
      })
    }
    
    // Watch for events changes
    watch(() => props.events, updateEventMarkers, { deep: true })
    
    // Handle event click from popup
    const handleEventClick = (event) => {
      const eventId = event.detail
      const clickedEvent = props.events.find(e => e.id === eventId)
      if (clickedEvent) {
        emit('event-click', clickedEvent)
      }
    }

    // Format week range for display
    const formatWeekRange = (week) => {
      if (!week) return ''
      return `${format(week.start, 'MMM dd')} - ${format(week.end, 'MMM dd')}`
    }
    
    onMounted(() => {
      initMap()
      updateEventMarkers()
      
      // Add global event listener for popup buttons
      window.addEventListener('event-click', handleEventClick)
    })
    
    onUnmounted(() => {
      if (map.value) {
        map.value.remove()
      }
      window.removeEventListener('event-click', handleEventClick)
    })
    
    return {
      mapContainer,
      currentBaseLayer,
      weekEventsCount,
      formatWeekRange,
      setBaseLayer
    }
  }
}
</script>

<style scoped>
.event-map-container {
  position: relative;
  width: 100%;
  height: 500px;
  min-height: 500px;
  display: block;
}

.map-container {
  width: 100%;
  height: 500px;
  min-height: 500px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 1000;
  max-width: 250px;
}

.layer-control,
.event-layers {
  margin-bottom: 1rem;
}

.layer-control h4,
.event-layers h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.layer-buttons {
  display: flex;
  gap: 0.25rem;
}

.layer-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-btn:hover {
  background: var(--bg-secondary);
}

.layer-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.layer-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.layer-toggle input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.toggle-label {
  flex: 1;
  color: var(--text-primary);
}

.event-count {
  background: var(--primary-color);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

.week-info {
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.week-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.week-events {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Popup styles */
:deep(.event-popup) {
  text-align: center;
  min-width: 200px;
}

:deep(.event-popup h3) {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

:deep(.event-popup p) {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

:deep(.event-popup button) {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

:deep(.event-popup button:hover) {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .map-controls {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 1rem;
    max-width: none;
  }
  
  .layer-buttons {
    flex-direction: column;
  }
}
</style> 