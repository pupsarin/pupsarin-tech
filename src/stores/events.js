import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, addDays, subDays } from 'date-fns'

export const useEventsStore = defineStore('events', () => {
  const events = ref([
    {
      id: 1,
      title: 'Tech Meetup 2024',
      description: 'Join us for an exciting evening of networking and tech talks!',
      date: '2024-01-15',
      time: '18:00',
      location: {
        name: 'Tech Hub Downtown',
        lat: 40.7128,
        lng: -74.0060
      },
      attendees: 45,
      maxAttendees: 100,
      category: 'Technology',
      createdBy: 'admin'
    },
    {
      id: 2,
      title: 'Art Gallery Opening',
      description: 'Experience local artists and their amazing works.',
      date: '2024-01-20',
      time: '19:00',
      location: {
        name: 'Modern Art Gallery',
        lat: 40.7589,
        lng: -73.9851
      },
      attendees: 23,
      maxAttendees: 50,
      category: 'Arts',
      createdBy: 'admin'
    },
    {
      id: 3,
      title: 'Food Festival',
      description: 'Taste cuisines from around the world in this amazing food festival.',
      date: '2024-01-25',
      time: '12:00',
      location: {
        name: 'Central Park',
        lat: 40.7829,
        lng: -73.9654
      },
      attendees: 120,
      maxAttendees: 200,
      category: 'Food',
      createdBy: 'admin'
    },
    {
      id: 4,
      title: 'Music Concert',
      description: 'Live music performance featuring local bands.',
      date: '2024-02-01',
      time: '20:00',
      location: {
        name: 'Music Hall',
        lat: 40.7505,
        lng: -73.9934
      },
      attendees: 89,
      maxAttendees: 150,
      category: 'Music',
      createdBy: 'admin'
    },
    {
      id: 5,
      title: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas to investors.',
      date: '2024-02-05',
      time: '17:30',
      location: {
        name: 'Innovation Center',
        lat: 40.7614,
        lng: -73.9776
      },
      attendees: 67,
      maxAttendees: 80,
      category: 'Business',
      createdBy: 'admin'
    }
  ])

  const userRSVPs = ref({
    1: 'attending',
    3: 'interested'
  })

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      attendees: 0,
      createdBy: 'admin'
    }
    events.value.push(newEvent)
    return newEvent
  }

  const updateEvent = (id, updates) => {
    const index = events.value.findIndex(event => event.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates }
    }
  }

  const deleteEvent = (id) => {
    const index = events.value.findIndex(event => event.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  const rsvpToEvent = (eventId, status) => {
    userRSVPs.value[eventId] = status
  }

  const getEventById = (id) => {
    return events.value.find(event => event.id === id)
  }

  const getEventsByDateRange = (startDate, endDate) => {
    return events.value.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startDate && eventDate <= endDate
    })
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events.value.filter(event => new Date(event.date) >= today)
  }

  const getPastEvents = () => {
    const today = new Date()
    return events.value.filter(event => new Date(event.date) < today)
  }

  const getEventsByCategory = (category) => {
    return events.value.filter(event => event.category === category)
  }

  const getUserRSVP = (eventId) => {
    return userRSVPs.value[eventId] || null
  }

  const getEventStats = () => {
    const total = events.value.length
    const upcoming = getUpcomingEvents().length
    const past = getPastEvents().length
    const totalAttendees = events.value.reduce((sum, event) => sum + event.attendees, 0)

    return {
      total,
      upcoming,
      past,
      totalAttendees
    }
  }

  return {
    events,
    userRSVPs,
    addEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    getEventById,
    getEventsByDateRange,
    getUpcomingEvents,
    getPastEvents,
    getEventsByCategory,
    getUserRSVP,
    getEventStats
  }
}) 