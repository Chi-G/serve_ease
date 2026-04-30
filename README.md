<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/utensils-crossed.svg" width="80" height="80" />
  <h1>ServeEase</h1>
</div>

<div align="center">
  <strong>The Elite POS & Restaurant Management Ecosystem</strong>
  <br/>
  <em>Elegance in Operations. Precision in Service.</em>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white" />
</div>

---

## Vision

**ServeEase** is not just a POS; it’s a high-performance administrative ecosystem designed for modern hospitality. Built with a focus on "Elite Aesthetics" and seamless user experience, ServeEase bridges the gap between complex backend management and fluid front-of-house operations.

## Core Pillars

ServeEase is built on four specialized modules, each tailored to a specific stakeholder in the restaurant ecosystem:

### 1. Super Admin (The Executive)
*Full high-level control and business intelligence.*
- **Financial Intelligence:** Real-time revenue dashboards and historical sales analytics.
- **Menu Engineering:** Dynamic management of the master product list, global pricing, and category hierarchies.
- **Table Orchestration:** Adding physical layout configurations and generating unique, secure QR packets.
- **Staffing Hierarchy:** Centralized account management for Managers, Waiters, and Kitchen staff.

### 2. Waiter Dashboard (The Operator)
*Precision tools for live floor management.*
- **Live Floor Operations:** Real-time table alerts and service request monitoring.
- **Service Display System:** Visual tracking of order statuses and table availability.
- **Active Alerts:** Instant notifications for ready orders or customer assistance.

### 3. Manager Hub (The Controller)
*Day-to-day operational excellence.*
- **Inventory Matrix:** Real-time stock tracking with low-stock predictive alerts.
- **Sales Reconciliation:** Daily sales reports and performance tracking.
- **Shift Management:** Active staff monitoring and scheduling.

### 4. Customer Experience (The Guest)
*Frictionless ordering without the app fatigue.*
- **Scan-to-Order:** Instant menu access via table-specific QR codes.
- **Order Tracking:** Real-time visibility into the kitchen's progress.
- **Elite Menu UI:** A vibrant, image-rich digital catalog designed to drive upsells.

## Tech Stack

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React 18 with Inertia.js (The monolith feel with SPA speed)
- **Styling:** Tailwind CSS (Custom "Elite" Dark/Glassmorphism theme)
- **Icons:** Lucide React
- **Real-time:** Laravel Reverb / Pusher (Websocket integration for live alerts)
- **Database:** MySQL / PostgreSQL

## Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL

### Step 1: Clone and Install
```bash
git clone https://github.com/Chi-G/serve_ease.git
cd serve_ease
composer install
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```
*Configure your database credentials in the `.env` file.*

### Step 3: Database & Seeding
```bash
php artisan migrate --seed
```

### Step 4: Launch
```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```

## Design Philosophy

ServeEase follows a **Premium Dark Aesthetic**:
- **Glassmorphism:** Subtle background blurs and border highlights.
- **Micro-animations:** Smooth transitions using Framer Motion (planned).
- **Typography:** High-contrast, bold italic headers for an "Elite" feel.
- **Responsiveness:** Mobile-first architecture for Waiters and Customers.

## Roadmap

- [x] Super Admin Dashboard Refactor
- [x] Menu Pagination (6 items/page)
- [x] Table & QR Pagination (3 items/page)
- [x] Waiter Dashboard Live Alerts
- [ ] Automated Financial PDF Reports
- [ ] Multi-language Support (i18n)
- [ ] Offline POS Mode (Service Worker)

---

<div align="center">
  Built with ❤️ by the Forahia Team.
</div>
