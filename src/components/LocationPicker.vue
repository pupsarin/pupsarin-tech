<template>
  <div class="location-picker">
    <div class="picker-header">
      <h3>Select Event Location</h3>
      <p>Click on the map to set the event location</p>
    </div>
    
    <div class="map-container">
      <div id="location-map" ref="mapContainer" class="location-map"></div>
      
      <!-- Location Info -->
      <div v-if="selectedLocation" class="location-info">
        <div class="location-details">
          <h4>Selected Location</h4>
          <p><strong>Latitude:</strong> {{ selectedLocation.lat.toFixed(6) }}</p>
          <p><strong>Longitude:</strong> {{ selectedLocation.lng.toFixed(6) }}</p>
          <p><strong>Address:</strong> {{ selectedLocation.address || 'Click on map to select location' }}</p>
        </div>
        <button @click="clearLocation" class="btn btn-outline btn-sm">
          Clear Location
        </button>
      </div>
    </div>
    
    <!-- Search Box -->
    <div class="search-container">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search for a location..."
          class="search-input"
          @keyup.enter="searchLocation"
        />
        <button @click="searchLocation" class="search-btn">
          🔍
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'LocationPicker',
  props: {
    initialLocation: {
      type: Object,
      default: () => ({ lat: 40.7128, lng: -74.0060 })
    },
    initialZoom: {
      type: Number,
      default: 13
    }
  },
  emits: ['location-selected', 'location-cleared'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    const map = ref(null)
    const marker = ref(null)
    const searchQuery = ref('')
    const selectedLocation = ref(null)
    
    // Initialize map
    const initMap = () => {
      if (!mapContainer.value) return
      
      // Create map instance
      map.value = L.map(mapContainer.value, {
        center: [props.initialLocation.lat, props.initialLocation.lng],
        zoom: props.initialZoom,
        zoomControl: true
      })
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value)
      
      // Add click handler
      map.value.on('click', handleMapClick)
      
      // Add search control
      addSearchControl()
    }
    
    // Handle map click
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng
      
      // Update or create marker
      if (marker.value) {
        marker.value.setLatLng([lat, lng])
      } else {
        marker.value = L.marker([lat, lng], {
          draggable: true
        }).addTo(map.value)
        
        // Add drag end handler
        marker.value.on('dragend', handleMarkerDragEnd)
      }
      
      // Update selected location
      selectedLocation.value = {
        lat,
        lng,
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }
      
      // Emit location selected event
      emit('location-selected', selectedLocation.value)
      
      // Reverse geocode to get address
      reverseGeocode(lat, lng)
    }
    
    // Handle marker drag end
    const handleMarkerDragEnd = (e) => {
      const { lat, lng } = e.target.getLatLng()
      
      selectedLocation.value = {
        lat,
        lng,
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }
      
      emit('location-selected', selectedLocation.value)
      reverseGeocode(lat, lng)
    }
    
    // Reverse geocoding using Nominatim
    const reverseGeocode = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
        const data = await response.json()
        
        if (data.display_name) {
          selectedLocation.value.address = data.display_name
          emit('location-selected', selectedLocation.value)
        }
      } catch (error) {
        console.log('Reverse geocoding failed:', error)
      }
    }
    
    // Search for location
    const searchLocation = async () => {
      if (!searchQuery.value.trim()) return
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=1`
        )
        const data = await response.json()
        
        if (data.length > 0) {
          const location = data[0]
          const lat = parseFloat(location.lat)
          const lng = parseFloat(location.lon)
          
          // Update map view
          map.value.setView([lat, lng], 16)
          
          // Update marker
          if (marker.value) {
            marker.value.setLatLng([lat, lng])
          } else {
            marker.value = L.marker([lat, lng], {
              draggable: true
            }).addTo(map.value)
            marker.value.on('dragend', handleMarkerDragEnd)
          }
          
          // Update selected location
          selectedLocation.value = {
            lat,
            lng,
            address: location.display_name
          }
          
          emit('location-selected', selectedLocation.value)
        }
      } catch (error) {
        console.log('Location search failed:', error)
      }
    }
    
    // Add search control to map
    const addSearchControl = () => {
      // Create a custom search control
      const searchControl = L.Control.extend({
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
          container.innerHTML = `
            <input type="text" placeholder="Search..." style="width: 200px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
          `
          
          const input = container.querySelector('input')
          input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
              searchQuery.value = input.value
              searchLocation()
            }
          })
          
          return container
        }
      })
      
      new searchControl({ position: 'topleft' }).addTo(map.value)
    }
    
    // Clear selected location
    const clearLocation = () => {
      if (marker.value) {
        map.value.removeLayer(marker.value)
        marker.value = null
      }
      
      selectedLocation.value = null
      emit('location-cleared')
    }
    
    // Watch for initial location changes
    watch(() => props.initialLocation, (newLocation) => {
      if (map.value && newLocation) {
        map.value.setView([newLocation.lat, newLocation.lng], props.initialZoom)
        
        if (marker.value) {
          marker.value.setLatLng([newLocation.lat, newLocation.lng])
        } else {
          marker.value = L.marker([newLocation.lat, newLocation.lng], {
            draggable: true
          }).addTo(map.value)
          marker.value.on('dragend', handleMarkerDragEnd)
        }
        
        selectedLocation.value = {
          lat: newLocation.lat,
          lng: newLocation.lng,
          address: newLocation.address || `Location at ${newLocation.lat.toFixed(6)}, ${newLocation.lng.toFixed(6)}`
        }
      }
    }, { immediate: true })
    
    onMounted(() => {
      initMap()
    })
    
    onUnmounted(() => {
      if (map.value) {
        map.value.remove()
      }
    })
    
    return {
      mapContainer,
      searchQuery,
      selectedLocation,
      searchLocation,
      clearLocation
    }
  }
}
</script>

<style scoped>
.location-picker {
  width: 100%;
}

.picker-header {
  margin-bottom: 1rem;
}

.picker-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.picker-header p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.map-container {
  position: relative;
  margin-bottom: 1rem;
}

.location-map {
  height: 400px;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.location-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  max-width: 300px;
  z-index: 1000;
}

.location-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.location-details p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.search-container {
  margin-bottom: 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
}

.search-btn:hover {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .location-map {
    height: 300px;
  }
  
  .location-info {
    position: relative;
    top: auto;
    left: auto;
    margin-top: 1rem;
    max-width: none;
  }
}
</style> 