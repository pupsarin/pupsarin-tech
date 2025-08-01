<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1>Admin Dashboard</h1>
      <p>Manage events and users</p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-card">
        <div class="stats-icon">📊</div>
        <div class="stats-number">{{ stats.total }}</div>
        <div class="stats-label">Total Events</div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">📅</div>
        <div class="stats-number">{{ stats.upcoming }}</div>
        <div class="stats-label">Upcoming Events</div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">👥</div>
        <div class="stats-number">{{ stats.totalAttendees }}</div>
        <div class="stats-label">Total Attendees</div>
      </div>

      <div class="stats-card">
        <div class="stats-icon">📈</div>
        <div class="stats-number">{{ stats.past }}</div>
        <div class="stats-label">Past Events</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link to="/create-event" class="btn btn-primary">
        ➕ Create New Event
      </router-link>
      <button @click="exportEvents" class="btn btn-outline">
        📊 Export Events
      </button>
      <button @click="refreshData" class="btn btn-outline">
        🔄 Refresh Data
      </button>
    </div>

    <!-- Event Management -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>Event Management</h2>
        <div class="section-actions">
          <select v-model="eventFilter" class="form-input">
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      <div class="events-table">
        <div class="table-header">
          <div class="table-cell">Event</div>
          <div class="table-cell">Date & Time</div>
          <div class="table-cell">Location</div>
          <div class="table-cell">Attendees</div>
          <div class="table-cell">Actions</div>
        </div>

        <div v-for="event in filteredEvents" :key="event.id" class="table-row">
          <div class="table-cell">
            <div class="event-info">
              <h4>{{ event.title }}</h4>
              <span class="event-category">{{ event.category }}</span>
            </div>
          </div>

          <div class="table-cell">
            <div class="date-time">
              <div>{{ formatDate(event.date) }}</div>
              <div class="time">{{ event.time }}</div>
            </div>
          </div>

          <div class="table-cell">
            <div class="location">{{ event.location.name }}</div>
          </div>

          <div class="table-cell">
            <div class="attendees">
              <span class="attendee-count"
                >{{ event.attendees }}/{{ event.maxAttendees }}</span
              >
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${(event.attendees / event.maxAttendees) * 100}%`
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="table-cell">
            <div class="action-buttons">
              <router-link
                :to="`/event/${event.id}`"
                class="btn btn-outline btn-sm"
              >
                👁️ View
              </router-link>
              <button @click="editEvent(event)" class="btn btn-outline btn-sm">
                ✏️ Edit
              </button>
              <button
                @click="deleteEvent(event.id)"
                class="btn btn-outline btn-sm btn-danger"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Management -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>User Management</h2>
      </div>

      <div class="users-table">
        <div class="table-header">
          <div class="table-cell">User</div>
          <div class="table-cell">Email</div>
          <div class="table-cell">Role</div>
          <div class="table-cell">Actions</div>
        </div>

        <div v-for="user in mockUsers" :key="user.id" class="table-row">
          <div class="table-cell">
            <div class="user-info">
              <div class="user-avatar">{{ user.name.charAt(0) }}</div>
              <div class="user-details">
                <h4>{{ user.name }}</h4>
                <span class="user-status">{{ user.status }}</span>
              </div>
            </div>
          </div>

          <div class="table-cell">
            <div class="email">{{ user.email }}</div>
          </div>

          <div class="table-cell">
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
          </div>

          <div class="table-cell">
            <div class="action-buttons">
              <button
                @click="changeUserRole(user)"
                class="btn btn-outline btn-sm"
              >
                🔄 Change Role
              </button>
              <button
                @click="toggleUserStatus(user)"
                class="btn btn-outline btn-sm"
              >
                {{ user.status === 'active' ? '🚫 Deactivate' : '✅ Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>Recent Activity</h2>
      </div>

      <div class="activity-list">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">
              {{ formatTime(activity.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useEventsStore } from '../stores/events'
import { format, formatDistanceToNow } from 'date-fns'

export default {
  name: 'DashboardPage',
  setup() {
    const eventsStore = useEventsStore()
    const eventFilter = ref('all')

    const stats = computed(() => eventsStore.getEventStats())

    const filteredEvents = computed(() => {
      let events = eventsStore.events

      switch (eventFilter.value) {
        case 'upcoming':
          events = eventsStore.getUpcomingEvents()
          break
        case 'past':
          events = eventsStore.getPastEvents()
          break
        case 'today': {
          const today = new Date()
          events = events.filter(event => {
            const eventDate = new Date(event.date)
            return (
              format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            )
          })
          break
        }
      }

      return events
    })

    // Mock user data
    const mockUsers = ref([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive'
      }
    ])

    // Mock recent activity
    const recentActivity = ref([
      {
        id: 1,
        icon: '🎉',
        text: 'New event "Tech Meetup 2024" created',
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: 2,
        icon: '👤',
        text: 'User "John Doe" registered',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        id: 3,
        icon: '📅',
        text: 'Event "Art Gallery Opening" updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
      },
      {
        id: 4,
        icon: '🗑️',
        text: 'Event "Old Workshop" deleted',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
      }
    ])

    const formatDate = dateString => {
      return format(new Date(dateString), 'MMM dd, yyyy')
    }

    const formatTime = timestamp => {
      return formatDistanceToNow(timestamp, { addSuffix: true })
    }

    const editEvent = event => {
      // In a real app, you'd navigate to an edit form
      console.log('Edit event:', event)
      alert(`Edit event: ${event.title}`)
    }

    const deleteEvent = eventId => {
      if (confirm('Are you sure you want to delete this event?')) {
        eventsStore.deleteEvent(eventId)
      }
    }

    const changeUserRole = user => {
      const newRole = user.role === 'admin' ? 'user' : 'admin'
      user.role = newRole
    }

    const toggleUserStatus = user => {
      user.status = user.status === 'active' ? 'inactive' : 'active'
    }

    const exportEvents = () => {
      const eventsData = eventsStore.events
      const dataStr = JSON.stringify(eventsData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'events-export.json'
      link.click()

      URL.revokeObjectURL(url)
    }

    const refreshData = () => {
      // In a real app, you'd refresh data from the server
      console.log('Refreshing data...')
      alert('Data refreshed!')
    }

    return {
      stats,
      eventFilter,
      filteredEvents,
      mockUsers,
      recentActivity,
      formatDate,
      formatTime,
      editEvent,
      deleteEvent,
      changeUserRole,
      toggleUserStatus,
      exportEvents,
      refreshData
    }
  }
}
</script>

<style scoped>
.dashboard-page {
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

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-card {
  background-color: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.stats-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stats-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.dashboard-section {
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.events-table,
.users-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.table-row:hover {
  background-color: var(--bg-secondary);
}

.table-cell {
  display: flex;
  align-items: center;
}

.event-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.event-category {
  background-color: var(--primary-color);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.date-time {
  font-size: 0.875rem;
}

.time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.location {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.attendees {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.attendee-count {
  font-size: 0.875rem;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--secondary-color);
  transition: width 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.btn-danger:hover {
  background-color: var(--danger-color);
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
}

.user-status {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.email {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: var(--primary-color);
  color: white;
}

.role-badge.user {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.activity-list {
  padding: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    flex-direction: column;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-cell {
    justify-content: flex-start;
  }

  .action-buttons {
    justify-content: flex-start;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>
