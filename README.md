# EventMap - Vue.js Event Management Application

A modern, responsive event management web application built with Vue.js 3, featuring interactive maps, user authentication, and admin dashboard functionality.

## Features

### 🗺️ Map Page

- **Real Interactive Map**: Powered by Leaflet with OpenStreetMap tiles
- **Multiple Map Layers**: Streets, Satellite, and Terrain views
- **Time Navigation**: Week-by-week navigation with range slider (25 events across 10 weeks)
- **Event Layer Management**: Toggle visibility of upcoming, past, and today's events
- **Smart Event Markers**: Color-coded markers based on event status (today=red, upcoming=green, past=grey)
- **Interactive Popups**: Click markers for event details and quick navigation
- **Week Preview**: See all events for the selected week with day-by-day breakdown
- **Advanced Filtering**: Filter events by category and layer type

### 👤 User Authentication

- **Login/Signup**: Secure authentication system with role-based access
- **User Role Management**: Differentiate between regular users and admins
- **Demo Accounts**:
  - Admin: `admin@example.com` / `admin123`
  - User: `user@example.com` / `user123`

### ⚙️ User Settings

- **Notification Preferences**: Email notifications, event reminders, alerts
- **Privacy Settings**: Profile visibility, attendance display, location sharing
- **Event Preferences**: Category preferences, distance range settings
- **Data Export**: Export user data as JSON

### 📅 Event Details

- **Comprehensive Event Info**: Title, description, date, time, location
- **Interactive Map**: Event location display
- **RSVP System**: Attend, interested, or not attending options
- **Attendee Tracking**: Real-time attendee count and capacity

### 🎯 Admin Features

- **Event Creation**: Create new events with real map location picker
- **Location Search**: Search for locations and get real addresses
- **Interactive Location Picker**: Click and drag to set precise event locations
- **Event Management**: View, edit, and delete events
- **User Management**: Manage user roles and account status
- **Dashboard Analytics**: Event statistics and recent activity
- **Data Export**: Export events data

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Modern CSS with CSS Variables
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd eventmap-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── MapPage.vue     # Main map view
│   ├── AuthPage.vue    # Authentication
│   ├── SettingsPage.vue # User settings
│   ├── CreateEventPage.vue # Event creation (admin)
│   ├── EventDetailsPage.vue # Event details
│   └── DashboardPage.vue # Admin dashboard
├── stores/             # Pinia stores
│   ├── auth.js         # Authentication state
│   └── events.js       # Events management
├── router/             # Vue Router configuration
├── style.css           # Global styles
├── main.js             # App entry point
└── App.vue             # Root component
```

## Mock Data

The application uses mock data for demonstration purposes:

### Events (25 Total)

**Past Events (Dec 2023):**

- Holiday Market, Winter Jazz Festival, Tech Year in Review

**Current & Future Events (Jan-Mar 2024):**

- New Year's Day Run, Art Exhibition Opening, Business Networking Mixer
- Cooking Workshop, Poetry Slam, Tech Meetup 2024, Yoga in the Park
- Art Gallery Opening, Food Festival, Classical Music Concert
- Startup Pitch Night, Music Concert, Book Reading & Discussion
- Photography Workshop, Comedy Night, Valentine's Day Dance
- AI & Machine Learning Summit, Fashion Week Show
- Marathon Training Session, Wine Tasting Event
- Spring Art Walk, Tech Career Fair

**Spread across 10 weeks with events Monday-Sunday**

### Users

- Admin User (admin@example.com)
- Regular User (user@example.com)

## Features in Detail

### Map Functionality

- **Real Map Integration**: Leaflet.js with OpenStreetMap tiles
- **Multiple Base Layers**: Streets, Satellite, and Terrain views
- **Time Navigation System**: Week-by-week navigation with interactive range slider
- **Event Layer Management**: Separate layers for upcoming, past, and today's events
- **Smart Markers**: Color-coded markers with interactive popups
- **Week Preview**: Detailed view of events for each selected week
- **Location Search**: Geocoding using Nominatim API
- **Interactive Location Picker**: Click and drag functionality for event creation
- **Responsive Design**: Works seamlessly on mobile and desktop

### Authentication System

- Role-based access control
- Protected routes for admin features
- Session management with Pinia

### Event Management

- CRUD operations for events
- Location picker with coordinate input
- Attendee tracking and RSVP system

### Admin Dashboard

- Real-time statistics
- Event and user management tables
- Recent activity feed
- Data export functionality

## Customization

### Styling

The application uses CSS variables for easy theming. Modify the variables in `src/style.css`:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  /* ... more variables */
}
```

### Adding New Features

1. Create new components in `src/views/` or `src/components/`
2. Add routes in `src/router/index.js`
3. Update stores as needed in `src/stores/`
4. Add navigation links in `src/App.vue`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Demo

The application includes demo accounts for testing:

- **Admin Account**: `admin@example.com` / `admin123`
- **User Account**: `user@example.com` / `user123`

Use these accounts to explore different user roles and permissions.

## Future Enhancements

- Real map integration (Google Maps, Mapbox, etc.)
- Backend API integration
- Real-time notifications
- Social features (sharing, comments)
- Advanced search and filtering
- Mobile app development
- Payment integration for paid events
