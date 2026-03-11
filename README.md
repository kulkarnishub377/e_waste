# 🌍 E-ZERO CORE

<div align="center">
  <img src="assets/e-zero-banner.png" alt="E-Zero Core Banner" width="800">

  **Enterprise-Grade E-Waste Logistics, Gamification & Predictive Analytics Platform**
  
  [![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
  [![Django](https://img.shields.io/badge/Django-5.0+-092E20.svg)](https://www.djangoproject.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![UI](https://img.shields.io/badge/UI-Glassmorphism-cyan.svg)]()
</div>

<br/>

E-Zero is an incredibly robust, full-stack enterprise web application designed to revolutionize electronic waste (E-Waste) management, carbon footprint tracking, and commodity trading logic for corporate and individual asset disposition. 

This repository houses the **complete** project: from an intensely beautiful, gamified Front-End interface, to complex algorithmic models and custom Machine Learning systems built natively into the Backend.

---

## 🔥 Master Feature Overview

E-Zero combines over a dozen discrete Django Apps (`accounts, blog, bookings, calculator, centers, contacts, core, services`) into a monolithic, unified platform.

### 1. 🎮 Eco-Warrior User Gamification (`accounts`)
*   **Authentication Hub:** Secure Register, Login, Logout, and User Preference routing.
*   **Eco-Leveling System:** Users possess an animated "Eco-Warrior" dashboard. As they recycle, an experiential Progress Bar tracks their level progression toward Master ranks.
*   **Achievement Badges:** Unlock interactive 3D Badges (e.g., "First Seed", "Hardware Hero") conditionally rendered through Django context based on recycle milestones.

### 2. 🚚 Complete Chain-of-Custody Logistics (`bookings`)
*   **Pickup Scheduling:** Users define their asset payload (laptops, servers, networks) and select specific 2-hour dispatch windows for E-Zero logistics to deploy.
*   **Data Sanitization Opt-In:** Clients request secure hardware wipes before recycling.
*   **Live Tracking Matrix:** View dynamic Operations Logs showing the progression from Pending -> Dispatched -> Completed.

### 3. 🧠 Artificial Intelligence Forecasting (`services/ml_predictor.py`)
*   **Pure Python Machine Learning:** A totally custom Artificial Intelligence engine built without heavy libraries. Calculates **Ordinary Least Squares (OLS) Linear Regression, Covariances, and R-Squared**.
*   **Utility:** Dynamically forecasts future e-waste influx volumes by mathematically evaluating multi-year historical datasets through intensive vector calculations, rendering an Executive AI Dashboard in the Django Admin portal.

### 4. 💰 Live Commodity Calculator (`calculator` & `services/market_api`)
*   **Interactive Value Estimator:** A beautifully designed frontend value calculator giving instant projections on potential payouts.
*   **Trading Algorithm:** Natively evaluates the percentage-yield breakdown (extracting trace Copper, Gold, Aluminum) against globally fluctuating USD commodity matrices via asynchronous Python requests.

### 5. 🗺️ Geolocation Facility Mapping (`centers`)
*   **Leaflet.js Integration:** A fully interactive mapping panel to track physical E-Zero processing nodes geographically.

### 6. 📄 Automated Compliance Engine (`services/pdf_generator.py`)
*   **NIST-800-88 Certification:** Utilizing the `reportlab` byte-buffer drafting engine, E-Zero programmatically draws and deploys heavily formatted compliance documents.
*   **Utility:** Once an admin marks a logistics mission `COMPLETED`, the system compiles the database payload into a downloadable, secure PDF Chain-of-Custody and Data Sanitization certificate right in the User's UI.

### 7. 📈 ESG Big-Data Analytics (`services/analytics.py` & `generate_historical_data.py`)
*   **Carbon Offsetting:** Analyzes incoming assets and calculates equivalent "Trees Planted" and "KG CO2" saved via in-memory vector scaling.
*   **Historical Data Ingestion Command:** Run `python manage.py generate_historical_data` to simulate up to five years of variable, time-series historical booking interactions to seed the ML model natively.

### 8. ✉️ Advanced Alerting Hub (`services/notifications.py`)
*   **Event Routing:** Synthesizes python templating syntax to transmit instantaneous, simulated secure dispatch confirmations (Mail/SMS) and ETA tracking statuses.

---

## 🎨 Premium Front-End Aesthetics 

E-Zero is defined by its cutting-edge, "Premium Neo-Internet" User Interface. It strictly utilizes Vanilla HTML, Advanced CSS3, and ES6 Javascript (No bloated JS frameworks).

*   **Glassmorphism Engine:** Translucent glass panels with blurred backdrops (`backdrop-filter`) over deep-space gradient ambient backgrounds.
*   **Global Preloader OS:** Navigating between pages triggers a glowing, 1.5-second "Booting E-Zero OS... Initializing Network" interlude.
*   **VanillaTilt 3D Interactions:** Mousing over stats, badges, and service cards dynamically tilts them mimicking physical holographic foil cards.
*   **Reading Progress Tracing:** Global Neon-Green scrollbar actively tracks depth on every view.
*   **Live "Network Online" Indicator:** In the top navigation header on desktop, a live system status indicator pulses indefinitely.

---

## 🚀 Installation & Deployment

E-Zero ensures a rapid, seamless local spin-up environment:

```bash
# 1. Clone the bleeding-edge repository
git clone https://github.com/organization/e-zero-core.git
cd e-zero-core/ezero_django

# 2. Establish isolated Python Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Pull all backend logic dependencies
pip install -r requirements.txt

# 4. Compile the SQL Architecture
python manage.py makemigrations
python manage.py migrate

# 5. Populate Data Analytics with 5 Years of Historical Data 
python manage.py generate_historical_data --years 5 --volume 5000

# 6. Ignite the Development Server
python manage.py runserver
```

### Accessing Systems
*   **Core UI / Authentication:** `http://127.0.0.1:8000/`
*   **Executive Admin Overseer:** `http://127.0.0.1:8000/admin/`

---

## 🛡️ License

This codebase is officially distributed under the **MIT License**. See `LICENSE` for the complete governing document. 

---

<div align="center">
  <i>System architecture maintained, designed, and engineered by the E-Zero Core Deep-Tech Team. 🍃</i>
</div>