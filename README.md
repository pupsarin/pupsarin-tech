# EventMap - Vue.js Event Management Application

A modern, responsive event management web application built with Vue.js 3, featuring interactive maps, user authentication, and admin dashboard functionality.

## Features

### 🗺️ Map Page
- **Interactive Map View**: Display events on a map with filtering capabilities
- **Event Filtering**: Filter events by date range (past week, upcoming, etc.)
- **Layer Scrolling**: Switch between past, upcoming, and today's events
- **Category Filtering**: Filter events by category (Technology, Arts, Food, etc.)

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
- **Event Creation**: Create new events with location picker
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

### Events
- Tech Meetup 2024
- Art Gallery Opening
- Food Festival
- Music Concert
- Startup Pitch Night

### Users
- Admin User (admin@example.com)
- Regular User (user@example.com)

## Features in Detail

### Map Functionality
- Mock map implementation with interactive location picking
- Event filtering by date, category, and layer
- Responsive design for mobile and desktop

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