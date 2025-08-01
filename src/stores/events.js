import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, addDays, subDays } from 'date-fns'

export const useEventsStore = defineStore('events', () => {
  const events = ref([
    // Past Events (December 2023)
    {
      id: 1,
      title: 'Holiday Market',
      description: 'Festive holiday market with local artisans and seasonal treats.',
      date: '2023-12-15',
      time: '10:00',
      location: {
        name: 'Union Square Park',
        lat: 40.7359,
        lng: -73.9911
      },
      attendees: 89,
      maxAttendees: 150,
      category: 'Food',
      createdBy: 'admin'
    },
    {
      id: 2,
      title: 'Winter Jazz Festival',
      description: 'Cozy winter jazz performances in an intimate setting.',
      date: '2023-12-20',
      time: '19:30',
      location: {
        name: 'Blue Note Jazz Club',
        lat: 40.7308,
        lng: -73.9986
      },
      attendees: 45,
      maxAttendees: 60,
      category: 'Music',
      createdBy: 'admin'
    },
    {
      id: 3,
      title: 'Tech Year in Review',
      description: 'Reflect on the biggest tech trends and innovations of 2023.',
      date: '2023-12-28',
      time: '18:00',
      location: {
        name: 'Google NYC Office',
        lat: 40.7411,
        lng: -73.9897
      },
      attendees: 78,
      maxAttendees: 120,
      category: 'Technology',
      createdBy: 'admin'
    },

    // Current Week Events (January 2024)
    {
      id: 4,
      title: 'New Year\'s Day Run',
      description: 'Start the year with a refreshing 5K run through the city.',
      date: '2024-01-01',
      time: '09:00',
      location: {
        name: 'Prospect Park',
        lat: 40.6602,
        lng: -73.9690
      },
      attendees: 156,
      maxAttendees: 200,
      category: 'Sports',
      createdBy: 'admin'
    },
    {
      id: 5,
      title: 'Art Exhibition Opening',
      description: 'Contemporary art showcase featuring emerging artists.',
      date: '2024-01-03',
      time: '18:00',
      location: {
        name: 'Whitney Museum',
        lat: 40.7396,
        lng: -74.0089
      },
      attendees: 67,
      maxAttendees: 100,
      category: 'Arts',
      createdBy: 'admin'
    },
    {
      id: 6,
      title: 'Business Networking Mixer',
      description: 'Connect with professionals from various industries.',
      date: '2024-01-05',
      time: '19:00',
      location: {
        name: 'The Standard Hotel',
        lat: 40.7384,
        lng: -74.0089
      },
      attendees: 89,
      maxAttendees: 120,
      category: 'Business',
      createdBy: 'admin'
    },

    // Week 2 (January 8-14)
    {
      id: 7,
      title: 'Cooking Workshop',
      description: 'Learn to cook authentic Italian cuisine with a master chef.',
      date: '2024-01-10',
      time: '14:00',
      location: {
        name: 'Eataly NYC',
        lat: 40.7411,
        lng: -73.9897
      },
      attendees: 23,
      maxAttendees: 30,
      category: 'Food',
      createdBy: 'admin'
    },
    {
      id: 8,
      title: 'Poetry Slam',
      description: 'Experience the power of spoken word and poetry.',
      date: '2024-01-12',
      time: '20:00',
      location: {
        name: 'Nuyorican Poets Cafe',
        lat: 40.7279,
        lng: -73.9837
      },
      attendees: 45,
      maxAttendees: 80,
      category: 'Entertainment',
      createdBy: 'admin'
    },

    // Week 3 (January 15-21)
    {
      id: 9,
      title: 'Tech Meetup 2024',
      description: 'Join us for an exciting evening of networking and tech talks!',
      date: '2024-01-15',
      time: '18:00',
      location: {
        name: 'WeWork - 350 5th Ave',
        lat: 40.7484,
        lng: -73.9857
      },
      attendees: 45,
      maxAttendees: 100,
      category: 'Technology',
      createdBy: 'admin'
    },
    {
      id: 10,
      title: 'Yoga in the Park',
      description: 'Join us for a relaxing yoga session in the heart of the city.',
      date: '2024-01-17',
      time: '08:00',
      location: {
        name: 'Bryant Park',
        lat: 40.7539,
        lng: -73.9857
      },
      attendees: 34,
      maxAttendees: 60,
      category: 'Sports',
      createdBy: 'admin'
    },
    {
      id: 11,
      title: 'Art Gallery Opening',
      description: 'Experience local artists and their amazing works.',
      date: '2024-01-20',
      time: '19:00',
      location: {
        name: 'MoMA - Museum of Modern Art',
        lat: 40.7614,
        lng: -73.9776
      },
      attendees: 23,
      maxAttendees: 50,
      category: 'Arts',
      createdBy: 'admin'
    },

    // Week 4 (January 22-28)
    {
      id: 12,
      title: 'Food Festival',
      description: 'Taste cuisines from around the world in this amazing food festival.',
      date: '2024-01-25',
      time: '12:00',
      location: {
        name: 'Central Park - Bethesda Fountain',
        lat: 40.7645,
        lng: -73.9713
      },
      attendees: 120,
      maxAttendees: 200,
      category: 'Food',
      createdBy: 'admin'
    },
    {
      id: 13,
      title: 'Classical Music Concert',
      description: 'An evening of classical music featuring the city orchestra.',
      date: '2024-01-27',
      time: '19:30',
      location: {
        name: 'Carnegie Hall',
        lat: 40.7648,
        lng: -73.9808
      },
      attendees: 234,
      maxAttendees: 280,
      category: 'Music',
      createdBy: 'admin'
    },

    // Week 5 (January 29 - February 4)
    {
      id: 14,
      title: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas to investors.',
      date: '2024-02-01',
      time: '17:30',
      location: {
        name: 'Flatiron Building',
        lat: 40.7411,
        lng: -73.9897
      },
      attendees: 67,
      maxAttendees: 80,
      category: 'Business',
      createdBy: 'admin'
    },
    {
      id: 15,
      title: 'Music Concert',
      description: 'Live music performance featuring local bands.',
      date: '2024-02-03',
      time: '20:00',
      location: {
        name: 'Madison Square Garden',
        lat: 40.7505,
        lng: -73.9934
      },
      attendees: 89,
      maxAttendees: 150,
      category: 'Music',
      createdBy: 'admin'
    },

    // Week 6 (February 5-11)
    {
      id: 16,
      title: 'Book Reading & Discussion',
      description: 'Join us for an evening of literature and thoughtful discussion.',
      date: '2024-02-10',
      time: '19:30',
      location: {
        name: 'The Strand Bookstore',
        lat: 40.7345,
        lng: -73.9903
      },
      attendees: 28,
      maxAttendees: 40,
      category: 'Education',
      createdBy: 'admin'
    },
    {
      id: 17,
      title: 'Photography Workshop',
      description: 'Learn street photography techniques from professionals.',
      date: '2024-02-11',
      time: '14:00',
      location: {
        name: 'High Line Park',
        lat: 40.7479,
        lng: -74.0048
      },
      attendees: 15,
      maxAttendees: 25,
      category: 'Education',
      createdBy: 'admin'
    },

    // Week 7 (February 12-18)
    {
      id: 18,
      title: 'Comedy Night',
      description: 'Laugh the night away with some of the city\'s best comedians.',
      date: '2024-02-15',
      time: '21:00',
      location: {
        name: 'Comedy Cellar',
        lat: 40.7308,
        lng: -73.9986
      },
      attendees: 56,
      maxAttendees: 80,
      category: 'Entertainment',
      createdBy: 'admin'
    },
    {
      id: 19,
      title: 'Valentine\'s Day Dance',
      description: 'Romantic evening of dancing and live music.',
      date: '2024-02-14',
      time: '20:00',
      location: {
        name: 'The Plaza Hotel',
        lat: 40.7645,
        lng: -73.9740
      },
      attendees: 89,
      maxAttendees: 120,
      category: 'Entertainment',
      createdBy: 'admin'
    },

    // Future Events (February 19-25)
    {
      id: 20,
      title: 'AI & Machine Learning Summit',
      description: 'Explore the latest developments in AI and ML technologies.',
      date: '2024-02-20',
      time: '09:00',
      location: {
        name: 'Javits Center',
        lat: 40.7579,
        lng: -74.0021
      },
      attendees: 234,
      maxAttendees: 300,
      category: 'Technology',
      createdBy: 'admin'
    },
    {
      id: 21,
      title: 'Fashion Week Show',
      description: 'Exclusive preview of upcoming fashion trends.',
      date: '2024-02-22',
      time: '19:00',
      location: {
        name: 'Lincoln Center',
        lat: 40.7725,
        lng: -73.9831
      },
      attendees: 156,
      maxAttendees: 200,
      category: 'Arts',
      createdBy: 'admin'
    },

    // Week 9 (February 26 - March 3)
    {
      id: 22,
      title: 'Marathon Training Session',
      description: 'Group training session for upcoming spring marathon.',
      date: '2024-02-28',
      time: '07:00',
      location: {
        name: 'Central Park - Reservoir',
        lat: 40.7829,
        lng: -73.9654
      },
      attendees: 67,
      maxAttendees: 100,
      category: 'Sports',
      createdBy: 'admin'
    },
    {
      id: 23,
      title: 'Wine Tasting Event',
      description: 'Sample wines from around the world with expert sommeliers.',
      date: '2024-03-01',
      time: '18:30',
      location: {
        name: 'Chelsea Market',
        lat: 40.7421,
        lng: -74.0060
      },
      attendees: 45,
      maxAttendees: 60,
      category: 'Food',
      createdBy: 'admin'
    },

    // Week 10 (March 4-10)
    {
      id: 24,
      title: 'Spring Art Walk',
      description: 'Guided tour of the city\'s best art galleries.',
      date: '2024-03-05',
      time: '14:00',
      location: {
        name: 'Chelsea Galleries',
        lat: 40.7421,
        lng: -74.0060
      },
      attendees: 34,
      maxAttendees: 50,
      category: 'Arts',
      createdBy: 'admin'
    },
    {
      id: 25,
      title: 'Tech Career Fair',
      description: 'Connect with top tech companies and find your next opportunity.',
      date: '2024-03-08',
      time: '10:00',
      location: {
        name: 'Brooklyn Expo Center',
        lat: 40.7182,
        lng: -73.9584
      },
      attendees: 189,
      maxAttendees: 250,
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