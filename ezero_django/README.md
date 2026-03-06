# 🌱 E-Zero — Django E-Waste Management System

> **India's Most Trusted E-Waste Recycling Platform**  
> A complete, full-stack Django web application for certified e-waste recycling and IT asset disposal services.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Django](https://img.shields.io/badge/Django-5.2-green?logo=django)
![License](https://img.shields.io/badge/License-Private-red)
![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Database Models](#-database-models)
- [API Endpoints](#-api-endpoints)
- [Admin Panel](#-admin-panel)
- [Management Commands](#-management-commands)
- [Frontend Design](#-frontend-design)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌍 Overview

**E-Zero** is a comprehensive e-waste management platform built with Django that provides:

- **Pickup Scheduling**: Book free doorstep e-waste collection with real-time tracking
- **Recycling Centers Map**: Find authorized collection points across India using interactive Leaflet maps
- **Pricing Calculator**: Get instant estimates for e-waste recycling value
- **Data Destruction Services**: NIST-compliant data sanitization with certified documentation
- **User Dashboard**: Track recycling history, reward points, and environmental impact
- **Compliance Management**: Generate certificates for E-Waste Rules 2016, EPR, and CSR compliance
- **Blog & Resources**: Stay updated with e-waste regulations, security guides, and sustainability insights
- **Live Chat Widget**: Instant support for scheduling and quotes

The platform serves both **B2B** (corporate IT asset disposal, bulk recycling programs) and **B2C** (residential pickup, individual recycling) segments across India.

---

## ✨ Features

### 🏠 Core Landing Page

- **Hero Section** with trust indicators, corporate logos, and floating stat cards
- **Stats Banner** — 50,000+ tons recycled, 500+ clients, 25+ facilities, 15+ years
- **Services Grid** — 6 services with icons, descriptions, and feature lists
- **Process Timeline** — 5-step visual flow from request to documentation
- **Why Choose Us** — Advantages with certification cards and impact highlights
- **Accepted Items** — 8 categories of accepted electronics
- **Testimonials** — Client reviews with star ratings
- **Environmental Impact Counters** — Animated counters (CO2, trees, landfill, metals)
- **FAQ Accordion** — Toggle-based Q&A section
- **Contact Form** — Multi-field form with service type and quantity selection
- **Blog Section** — Latest articles with category badges

### 🗺️ Recycling Centers

- **Interactive Leaflet Map** with marker clustering
- **Center Cards** with address, rating, hours, and services
- **Search & Filter** by city or pincode
- **Center Detail Pages** with full info and accepted items
- **JSON API** for dynamic map integration

### 📅 Bookings System

- **Multi-step Booking Form** — Customer info → Items → Schedule → Confirmation
- **Auto-generated Booking IDs** (EZ-000001 format)
- **Status Tracking** — Pending → Scheduled → Assigned → In Transit → Completed
- **Booking Invoice/Detail** page with print support
- **JSON API** for modal-based booking from the landing page
- **Service Add-ons** — Data destruction, compliance certificate

### 💰 Pricing Calculator

- **10 item types** with per-unit pricing (Laptop, Desktop, Server, etc.)
- **Quantity selector** with +/- buttons
- **Real-time total calculation** with INR formatting
- **Service options** — Data destruction, priority pickup, on-site shredding

### 📰 Blog & Resources

- **Article List** with pagination (9 per page)
- **Category filtering** — Regulations, Security, Sustainability, Safety, Guides
- **Article Detail** with full HTML content, hero image, read time
- **Auto-slugifying** titles for SEO-friendly URLs

### 👤 User Accounts

- **Registration** with phone, email, name, and password
- **Login / Logout** with redirect handling
- **User Dashboard** — Booking history, reward points, level, CO₂ saved
- **Profile Editing** — Update name, email, phone, language preference
- **Auto-created UserProfile** via Django signals
- **Gamification** — Wallet points, levels, achievements

### 📧 Contact System

- **Quote Request Form** — Name, company, email, phone, city, service type, quantity, message
- **AJAX Support** — Async form submission for homepage contact
- **Admin tracking** — Mark as handled, assign handler, add admin notes

### 🛡️ Admin Panel

- **Custom branding** — E-Zero Administration header and dashboard title
- **All models registered** with:
  - Inline editing for orders, prices, and active status
  - Search, filtering, and date hierarchies
  - Fieldsets and inline items (BookingItem inside Booking)
  - Prepopulated slug fields

### 🔧 Management Commands

- **`python manage.py seed_data`** — Seeds entire database:
  - 4 site stats, 6 services, 5 process steps, 5 advantages
  - 4 certifications, 6 FAQs, 3 testimonials, 8 accepted item categories
  - 4 impact stats, 10 calculator items, 3 service options, 3 articles
  - All centers from `centers.json` (20+ centers across India)
  - All users from `users.json` with profiles and achievements
  - Auto-creates superuser (`admin` / `EZero@2024`)
- **`--clear` flag** to wipe and re-seed

---

## 🛠️ Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| **Backend**    | Python 3.11, Django 5.2                    |
| **Database**   | SQLite (dev), PostgreSQL-ready             |
| **Frontend**   | HTML5, CSS3 (Vanilla), JavaScript (ES6+)   |
| **Fonts**      | Google Fonts — Inter, Outfit               |
| **Icons**      | Font Awesome 6.4                           |
| **Maps**       | Leaflet.js + OpenStreetMap + MarkerCluster |
| **Templating** | Django Template Language (DTL)             |

---

## 📁 Project Structure

```
ezero_django/
├── manage.py                       # Django management script
├── requirements.txt                # Python dependencies
├── db.sqlite3                      # SQLite database (auto-created)
│
├── ezero/                          # Project configuration
│   ├── settings.py                 # Django settings (all apps, DB, static, auth)
│   ├── urls.py                     # Root URL router (includes all app URLs)
│   ├── wsgi.py                     # WSGI entry point
│   └── asgi.py                     # ASGI entry point
│
├── core/                           # Core app (home page, site-wide)
│   ├── models.py                   # Service, ProcessStep, Advantage, Certification,
│   │                               #   FAQ, Testimonial, AcceptedItemCategory,
│   │                               #   ImpactStat, SiteStat (9 models)
│   ├── views.py                    # HomePageView, AboutPageView
│   ├── admin.py                    # All core model registrations
│   ├── urls.py                     # / and /about/
│   ├── context_processors.py       # Site-wide settings injection
│   ├── templatetags/
│   │   └── core_tags.py            # star_range, currency_inr, active_nav
│   └── management/commands/
│       └── seed_data.py            # Database seeding command
│
├── centers/                        # Recycling centers
│   ├── models.py                   # Center model (location, services, ratings)
│   ├── views.py                    # CenterListView, CenterDetailView, centers_api
│   ├── admin.py                    # Center admin with city filtering
│   └── urls.py                     # /centers/, /centers/api/, /centers/<id>/
│
├── bookings/                       # Pickup booking system
│   ├── models.py                   # Booking, BookingItem (with auto-ID)
│   ├── views.py                    # CRUD views + JSON API
│   ├── forms.py                    # BookingStep1Form, BookingStep3Form, BookingItemForm
│   ├── admin.py                    # Booking admin with inline items + fieldsets
│   └── urls.py                     # /bookings/, /bookings/create/, /bookings/api/
│
├── blog/                           # Articles & resources
│   ├── models.py                   # Article (with auto-slug)
│   ├── views.py                    # ArticleListView (paginated), ArticleDetailView
│   ├── admin.py                    # Article admin with slug auto-population
│   └── urls.py                     # /blog/, /blog/<slug>/
│
├── contacts/                       # Contact form & quotes
│   ├── models.py                   # ContactRequest (with admin tracking)
│   ├── views.py                    # ContactFormView (AJAX + standard)
│   ├── forms.py                    # ContactForm
│   ├── admin.py                    # ContactRequest admin with status tracking
│   └── urls.py                     # /contact/
│
├── calculator/                     # Pricing calculator
│   ├── models.py                   # RecyclableItem, ServiceOption
│   ├── views.py                    # CalculatorView, calculator_items_api
│   ├── admin.py                    # Items + options with inline price editing
│   └── urls.py                     # /calculator/, /calculator/api/
│
├── accounts/                       # User authentication & profiles
│   ├── models.py                   # UserProfile (with signals for auto-creation)
│   ├── views.py                    # Register, Login, Logout, Dashboard, Profile
│   ├── forms.py                    # RegistrationForm, LoginForm, ProfileForm
│   ├── admin.py                    # UserProfile admin
│   └── urls.py                     # /accounts/register|login|logout|dashboard|profile/
│
├── templates/                      # Django templates
│   ├── base.html                   # Base layout (meta, fonts, scripts, blocks)
│   ├── includes/
│   │   ├── header.html             # Navigation with auth-aware menu
│   │   ├── footer.html             # Footer with links and socials
│   │   └── chat_widget.html        # Live chat widget
│   ├── core/
│   │   ├── home.html               # Full landing page (800+ lines)
│   │   └── about.html              # About page
│   ├── accounts/
│   │   ├── login.html              # Login form
│   │   ├── register.html           # Registration form
│   │   ├── dashboard.html          # User dashboard
│   │   └── profile.html            # Profile editing
│   ├── bookings/
│   │   ├── booking_create.html     # Booking form
│   │   ├── booking_detail.html     # Booking invoice
│   │   └── booking_list.html       # User's bookings
│   ├── blog/
│   │   ├── article_list.html       # Blog listing with pagination
│   │   └── article_detail.html     # Full article view
│   ├── centers/
│   │   ├── center_list.html        # Map + center cards
│   │   └── center_detail.html      # Single center view
│   ├── contacts/
│   │   └── contact.html            # Contact form page
│   └── calculator/
│       └── calculator.html         # Pricing calculator
│
└── static/                         # Static assets
    ├── css/
    │   └── styles.css              # Complete design system (Premium Eco theme)
    ├── js/
    │   ├── app.js                  # Core: header, animations, FAQ, notifications
    │   ├── calculator.js           # Calculator quantity & pricing logic
    │   ├── map.js                  # Leaflet map with center markers
    │   ├── chat.js                 # Chat widget interactions
    │   ├── booking.js              # Booking form date validation
    │   └── features.js             # Additional features
    └── assets/
        └── logo.svg                # E-Zero logo
```

**Total**: ~55+ Python/HTML/JS/CSS files across 7 Django apps.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip

### Setup

```bash
# 1. Navigate to the Django project
cd ezero_django

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run database migrations
python manage.py makemigrations
python manage.py migrate

# 4. Seed the database with initial data
python manage.py seed_data

# 5. Start the development server
python manage.py runserver
```

### Access

| URL                                      | Description        |
| ---------------------------------------- | ------------------ |
| `http://127.0.0.1:8000/`                 | Homepage           |
| `http://127.0.0.1:8000/admin/`           | Admin Panel        |
| `http://127.0.0.1:8000/accounts/login/`  | User Login         |
| `http://127.0.0.1:8000/centers/`         | Centers Map        |
| `http://127.0.0.1:8000/calculator/`      | Pricing Calculator |
| `http://127.0.0.1:8000/blog/`            | Blog               |
| `http://127.0.0.1:8000/contact/`         | Contact Form       |
| `http://127.0.0.1:8000/bookings/create/` | Book Pickup        |

### Default Admin Credentials

| Username | Password     |
| -------- | ------------ |
| `admin`  | `EZero@2024` |

---

## ⚙️ Configuration

All settings are in `ezero/settings.py`:

```python
# Site Information
EZERO_SITE_NAME = 'E-Zero'
EZERO_SITE_TAGLINE = 'Certified E-Waste Recycling & IT Asset Disposal Services'
EZERO_PHONE = '+91 98765 43210'
EZERO_EMAIL = 'info@ezero.in'
EZERO_ADDRESS = 'E-Zero Technologies Pvt. Ltd., 123 Green Business Park, Pune 411001'

# Authentication
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/accounts/dashboard/'
LOGOUT_REDIRECT_URL = '/'

# Timezone
TIME_ZONE = 'Asia/Kolkata'
```

---

## 📊 Database Models

| App          | Models                                                                                                       | Description                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `core`       | Service, ProcessStep, Advantage, Certification, FAQ, Testimonial, AcceptedItemCategory, ImpactStat, SiteStat | Landing page content                              |
| `centers`    | Center                                                                                                       | Recycling facility locations with geo-coordinates |
| `bookings`   | Booking, BookingItem                                                                                         | Pickup scheduling with item tracking              |
| `blog`       | Article                                                                                                      | Blog posts with categories and slugs              |
| `contacts`   | ContactRequest                                                                                               | Contact form submissions with admin tracking      |
| `calculator` | RecyclableItem, ServiceOption                                                                                | Pricing data for the calculator                   |
| `accounts`   | UserProfile                                                                                                  | Extended user data with gamification              |

**Total: 16 models across 7 apps**

---

## 🔌 API Endpoints

| Endpoint           | Method | Description                          |
| ------------------ | ------ | ------------------------------------ |
| `/centers/api/`    | GET    | JSON list of all active centers      |
| `/calculator/api/` | GET    | Calculator items and service options |
| `/bookings/api/`   | POST   | Create booking via JSON              |
| `/contact/`        | POST   | Submit contact form (AJAX supported) |

---

## 🎨 Frontend Design

The application uses the **Premium Eco** design system ported from the existing static site:

- **Color Palette**: Emerald green (#10B981) primary, dark backgrounds, gradient accents
- **Typography**: Outfit (headings), Inter (body) from Google Fonts
- **Design Elements**: Glassmorphism cards, gradient borders, micro-animations
- **Icons**: Font Awesome 6.4 (200+ icons used)
- **Maps**: Leaflet.js with OpenStreetMap tiles and marker clustering
- **Responsive**: Mobile-first with hamburger menu and adaptive grids
- **Animations**: Scroll-triggered reveals, counter animations, hover effects

---

## 🧪 Testing

```bash
# Check for migration issues
python manage.py makemigrations --check

# Run Django system checks
python manage.py check

# Test seed data
python manage.py seed_data --clear

# Run development server
python manage.py runserver
```

---

## 🚢 Deployment

### Production Checklist

1. Set `DEBUG = False` in settings
2. Change `SECRET_KEY` to a secure value
3. Configure `ALLOWED_HOSTS`
4. Switch to PostgreSQL
5. Run `python manage.py collectstatic`
6. Configure WSGI (Gunicorn) or ASGI (Daphne/Uvicorn)
7. Set up Nginx as reverse proxy
8. Enable HTTPS

### Environment Variables (Production)

```bash
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/ezero
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<p align="center">
  <strong>🌱 E-Zero — Making the world cleaner, one device at a time.</strong><br>
  <em>Built with Django 5.2 • Python 3.11</em>
</p>
