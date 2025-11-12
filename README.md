# E-Zero E-Waste Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile--First-blue.svg)](https://tailwindcss.com/)

A cutting-edge, AI-powered web application revolutionizing e-waste management through intelligent recycling center discovery, seamless doorstep pickup scheduling, gamified rewards systems, and comprehensive analytics dashboards. Built with modern web technologies for optimal performance, accessibility, and user experience.

## 🚀 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## ✨ Features

### Core Functionality
- **AI-Powered Item Identification**: Upload photos or use voice descriptions for instant e-waste valuation and categorization
- **Interactive Map Discovery**: Real-time recycling center locator with OpenStreetMap integration, geolocation, and custom markers
- **Smart Pickup Scheduling**: Intuitive booking system with date/time selection, photo uploads, and automated confirmations
- **Gamified Rewards System**: Points-based incentives with achievements, leaderboards, and redemption options
- **Environmental Impact Tracking**: Real-time CO₂ savings, recycling statistics, and progress visualizations

### Advanced Capabilities
- **Multi-Language Support**: Seamless switching between English, Hindi, and Marathi with custom i18n
- **Progressive Web App (PWA)**: Offline functionality, installable experience, and service worker caching
- **Admin Dashboard**: Comprehensive management interface for bookings, centers, users, and analytics
- **Dark/Light Theme Toggle**: Adaptive UI with smooth transitions and user preference persistence
- **Accessibility First**: WCAG 2.1 compliant with ARIA labels, keyboard navigation, and screen reader support
- **Real-Time Notifications**: Toast notifications, in-app alerts, and push notification integration
- **Data Visualizations**: Interactive charts powered by Chart.js for trends, impact metrics, and performance analytics

### User Experience Enhancements
- **Responsive Design**: Mobile-first approach optimized for all devices and screen sizes
- **Smooth Animations**: Lottie-powered micro-interactions and CSS transitions for engaging UX
- **Form Validation**: Real-time input validation with user-friendly error handling
- **Search & Filter**: Advanced filtering for centers, items, and bookings
- **Social Integration**: Referral system with friend invites and community leaderboards

## 🛠 Tech Stack

### Frontend Framework
- **HTML5**: Semantic markup with structured data (Schema.org)
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vanilla JavaScript (ES6+)**: Modular architecture with ES modules for maintainability

### Libraries & Tools
- **Leaflet.js**: Interactive maps with OpenStreetMap tiles
- **Chart.js**: Advanced data visualizations and analytics
- **Lottie**: Vector animations for micro-interactions
- **SweetAlert2**: Beautiful modal dialogs and confirmations
- **Lucide Icons**: Consistent iconography across the application

### Development & Deployment
- **PWA Features**: Service Worker (sw.js), Web App Manifest (manifest.json)
- **Internationalization**: Custom i18n system with JSON-based translations
- **Build Tools**: Modular JavaScript with import/export
- **Version Control**: Git for collaborative development

### Browser Support
- Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- Mobile browsers: iOS Safari, Chrome Mobile, Samsung Internet

## 📁 Project Structure

```
e-zero/
├── index.html                 # Main user application entry point
├── admin.html                 # Admin dashboard interface
├── manifest.json              # PWA manifest for installable app
├── sw.js                      # Service worker for offline caching
├── i18n.json                  # Multi-language translations
├── css/
│   ├── tailwind.css          # Tailwind CSS framework
│   └── styles.css            # Custom component styles and variables
├── js/
│   ├── app.js                # Core application logic and state management
│   ├── i18n.js               # Internationalization utilities
│   ├── theme.js              # Theme switching and persistence
│   ├── map.js                # Map rendering and center interactions
│   ├── booking.js            # Pickup scheduling and form handling
│   ├── rewards.js            # Points system and achievement tracking
│   ├── charts.js             # Data visualization components
│   ├── admin.js              # Admin panel functionality
│   └── app-old.js            # Legacy application code (deprecated)
├── assets/
│   ├── logo.svg              # Brand logo and favicon
│   ├── icons/                # UI icons and markers
│   └── illustrations/        # Lottie animations and graphics
└── data/
    ├── centers.json          # Recycling center database
    ├── users.json            # User profiles and activity data
    └── bookings.json         # Pickup booking records
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for map tiles and external libraries
- Optional: Local server for advanced PWA features

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/e-zero.git
   cd e-zero
   ```

2. **Open in Browser**
   - For user app: Open `index.html` in your browser
   - For admin: Open `admin.html` in your browser
   - For full PWA experience: Serve via local server (e.g., `python -m http.server 8000`)

3. **Enable PWA Features** (Optional)
   - Install the app from browser menu
   - Grant location permissions for map functionality

### Configuration
- Update `data/centers.json` with local recycling center information
- Modify `i18n.json` for additional language support
- Customize colors and themes in `css/styles.css`

## 📖 Usage

### For Users
1. **Discover Centers**: Use the interactive map to find nearby recycling facilities
2. **Schedule Pickup**: Fill the booking form with item details and preferred time
3. **Earn Rewards**: Accumulate points through recycling and complete challenges
4. **Track Impact**: Monitor your environmental contribution in the dashboard

### For Admins
1. **Access Dashboard**: Log in via `admin.html`
2. **Manage Bookings**: View, approve, and track pickup requests
3. **Monitor Analytics**: Review charts for trends and performance metrics
4. **Update Centers**: Add or modify recycling center information

### Key Interactions
- **Map Navigation**: Click markers for center details, use search filters
- **Booking Flow**: Upload photos, select items, choose dates
- **Rewards System**: View points balance, redeem rewards, check leaderboards
- **Theme Toggle**: Switch between light/dark modes via header button

## 📸 Screenshots

### Main Dashboard
![Dashboard](assets/screenshots/dashboard.png)
*User dashboard showing points, achievements, and recent activity*

### Interactive Map
![Map View](assets/screenshots/map.png)
*Map interface with recycling centers and user location*

### Booking Form
![Booking](assets/screenshots/booking.png)
*Pickup scheduling form with item selection and photo upload*

### Admin Analytics
![Admin Dashboard](assets/screenshots/admin.png)
*Admin panel with booking management and data visualizations*

## 🔌 API Reference

### Core Functions (app.js)
- `initApp()`: Initialize application state and components
- `updateUserData(user)`: Update user profile and sync data
- `showNotification(message, type)`: Display toast notifications

### Map Functions (map.js)
- `initMap()`: Render Leaflet map with centers
- `showCenterDetails(center)`: Display center information modal
- `getDirections(lat, lng)`: Open navigation in external app

### Rewards Functions (rewards.js)
- `updatePoints(points)`: Add/subtract user points
- `displayActivityLog()`: Render activity history
- `checkAchievements()`: Validate and unlock achievements

### Utility Functions
- `formatNumber(num)`: Format large numbers (K/M)
- `debounce(func, delay)`: Debounce function calls
- `showNotification()`: Cross-platform notification system

## 🤝 Contributing

We welcome contributions to improve E-Zero! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ES6+ standards and modular architecture
- Maintain responsive design principles
- Ensure accessibility compliance
- Add JSDoc comments for new functions
- Test across supported browsers

### Code Style
- Use consistent naming conventions
- Leverage Tailwind utility classes
- Optimize for performance and bundle size
- Include error handling and validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for map data and tiles
- **Tailwind CSS** for the utility-first framework
- **Chart.js** for visualization capabilities
- **Lottie** for smooth animations
- **Leaflet** for mapping functionality
- **SweetAlert2** for modal components

Built with ❤️ for a sustainable future. Help us reduce e-waste one device at a time!

---

*For questions or support, please open an issue on GitHub.*