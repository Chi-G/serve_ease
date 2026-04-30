# ServeEase: Customer Experience & Architecture Documentation

This document outlines the architecture and implementation details for the customer-facing side of ServeEase, specifically focusing on how guests interact with the digital menu and how the system manages their session.

## 1. Dynamic Table Management (QR-Ready)

The system is designed to be fully dynamic, allowing physical tables to be represented by unique URLs.

### URL Structure
- **Format**: `/table/{table_number}`
- **Example**: `/table/8` represents a guest sitting at physical Table 8.
- **QR Implementation**: In a real-world scenario, a QR code sticker on Table 8 will point directly to the `/table/8` URL.

### Data Flow
1. **Entry**: Guest scans QR -> Browser hits `/table/{table_number}`.
2. **Backend**: Laravel identifies the table from the database and passes the `tableNumber` prop to the Inertia `Welcome` page.
3. **Session Store**: Upon guest registration (entering names), the `tableNumber` is saved to `localStorage`.
4. **State Management**: The `GroupOrderProvider` reads this ID and provides it to all child components (Menu, Cart, Checkout).
5. **Ordering**: When the order is submitted, the `table_id` is sent to the database, allowing the kitchen to know exactly where to deliver the food.

---

## 2. Menu Architecture & Product Seeding

The menu is fully data-driven, moving away from hardcoded mockups to a dynamic database system.

### Product Seeding
- **Database Table**: `products`
- **Seeder**: `MockDataSeeder.php`
- **Content**: 20 high-fidelity items including:
    - **Burgers & Pizzas** (Classic and Spicy variants)
    - **Main Courses** (Grilled Salmon, Ribeye Steak, Jollof Rice)
    - **Salads & Appetizers** (Caesar Salad, Chicken Wings)
    - **Desserts & Drinks** (Cheesecake, Iced Coffee, Mocktails)
- **Imagery**: Integrated with high-resolution Unsplash URLs for a premium "wow" factor.

### UI/UX Implementation
- **Responsive Grid**:
    - **Mobile**: 2 columns (Maximized image impact).
    - **Tablets/Wide Screens**: 3-4 columns (Optimized for space).
- **Opaque Headers**: Sticky headers for Search and Categories are solid dark (`#0A0A0A`) to prevent background bleed during scrolling.
- **Image Fallbacks**: The `ImageWithFallback` component ensures no broken images appear if a link fails, maintaining a professional look.

---

## 3. Operational Features

### Call Waiter System
Guests can request assistance directly from the header. Options include:
- 💧 Need Water
- 🍴 Extra Cutlery
- 🧾 Request Bill
- 🙋 General Help
- 🧂 Condiments
- ⚠️ Report Issue

### Protein Upselling
Before adding main courses to the cart, guests are prompted to add proteins (Grilled Chicken, Beef, Fish), increasing the average order value (AOV) for the restaurant.

---

## 4. Payment & Order Hardening

### Production-Ready Flow
The ordering process has been hardened for high-traffic, production environments:
1. **Customer Identity**: Orders now require a validated email address. The system automatically links orders to a persistent `customer_id` in the database, enabling future loyalty rewards and CRM tracking.
2. **Pending Order Recovery**: Before redirecting to Paystack, the system saves the entire order payload to a `pending_orders` table. This ensures that even if a customer's session expires or they clear their cookies during payment, the order is never lost.
3. **Pessimistic Locking**: During order confirmation, the system uses database-level locks (`lockForUpdate`) to prevent race conditions and ensure that two people cannot buy the same "last" item simultaneously.

### Receipt Automation
ServeEase provides immediate digital feedback:
- **Email Receipts**: Upon successful payment, an automated, professionally designed HTML receipt is sent to the customer's email.
- **Wait Time Transparency**: Every order starts with a dynamic **10-minute** preparation window, visualized through a live countdown timer.

---

## 5. Live Service Feedback

### Active Order Tracking
The customer is never "left in the dark" regarding their food:
- **Floating Status Badge**: A persistent, glassmorphic badge appears at the bottom of the app after an order is placed. It stays visible while the guest browses the menu or adds more items.
- **Ready Notification**: When the kitchen marks an order as ready (or the timer expires), the badge pulses green and transforms into a **"READY"** alert.
- **The "Ready" Screen**: A dedicated tracking page shows a giant queue number and a "Notify Waiter" button to facilitate smooth pickup or delivery.

---

## 6. Inventory Intelligence
Products are no longer just "available" or "unavailable." They are linked to a real-time `stock_count`:
- **Auto-Sold Out**: When stock hits zero, the product automatically flips to `outofstock` and is visually disabled on the menu.
- **Inventory Decrementing**: Stock is deducted the moment a payment is verified, ensuring 100% accuracy in stock levels.

---

## 7. Testing (Development)

To test a specific table without a physical QR code:
1. Navigate manually to `http://serveease.test/table/8`.
2. Observe the "Table 8" label in the welcome screen and header.
3. Complete an order to see it associated with Table 8 in the database/localStorage.
4. **Mock Payment**: Use Paystack's test cards to verify the full callback and receipt delivery flow.

---

## 8. Internal Roles & Operational Ecosystem

To support the customer experience, the system implements three core staff roles:

### Super Admin (The Command Center)
*   **Access**: Full system visibility.
*   **Workflow**: Managing staff accounts, dynamic table/QR generation, and high-level revenue analytics.

### Kitchen Manager (Kitchen Display System - KDS)
*   **Access**: Order status and inventory control.
*   **Workflow**: 
    1.  Receives live order alerts.
    2.  Updates status from **"Pending"** to **"In Preparation"**.
    3.  Marks orders as **"Ready"**, which triggers the customer's floating badge to pulse green.
    4.  Manages real-time `stock_count` for active service.

### Service Captain (Waiter Dashboard)
*   **Access**: Service requests and table occupancy.
*   **Workflow**: 
    1.  Resolves "Call Waiter" alerts (Water, Cutlery, Bill).
    2.  Monitors table status to optimize floor turnover.

## 9. Internal Staff Operations (Hardened)

The backend operations have been synchronized with the customer experience to ensure a professional, low-latency service loop.

### Kitchen Display System (KDS)
- **Status**: [x] PRODUCTION READY
- **Features**: 
    - Full-screen glassmorphic interface for chefs.
    - Real-time status transitions: `Pending` -> `In-Kitchen` -> `Ready` -> `Served`.
    - **Auditory Alerts**: Local `is-ready.mp3` triggers for tactile confirmation on all kitchen actions.
    - **Automatic Sync**: Marking an order as "Ready" instantly updates the customer's floating status badge via Laravel Echo.

### Service Captain (Waiter Dashboard)
- **Status**: [x] PRODUCTION READY
- **Features**:
    - Live monitoring of table-side requests (Water, Bill, Assistance).
    - **One-Click Resolution**: Waiters can resolve and clear requests as they attend to tables.
    - **Intelligent Routing**: Automatic login redirection ensures waiters land directly on their operational dashboard.

---

*Last Updated: April 30, 2026 (Internal Staff Operations & KDS Hardening Update)*
