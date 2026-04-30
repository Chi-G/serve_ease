I didn't fully weave them into the technical sections of the previous response—I only listed them as proposals. To ensure your developers have a single, airtight source of truth, here is the **full, integrated implementation strategy** with all 4 features (Call Waiter, AI Upselling, Loyalty, and Show-Glass Manager) baked into the core architecture.

---

# **Forahia ServeEase: Master Implementation Blueprint**

## **1. The Technical Stack**
* **Backend:** Laravel 11.x
* **Database:** PostgreSQL (Primary) + Redis (for real-time caching and queueing)
* **Frontend:** React 18+ with Inertia.js (SSR enabled for fast initial menu loads)
* **Real-time:** Laravel Reverb (WebSockets)
* **Payments:** Paystack/Flutterwave API

---

## **2. Integrated Database Schema (PostgreSQL)**

* **`tables`**: `id`, `table_num`, `uuid` (for signed QR routes), `status` (occupied/vacant).
* **`products`**: `id`, `name`, `price`, `category`, **`is_in_showglass`** (boolean), **`stock_status`** (instock/oos), `tags` (for AI upselling).
* **`orders`**: `id`, `session_id`, `total_price`, `queue_number`, `status` (`pending`, `preparing`, `ready`, `completed`).
* **`order_items`**: `id`, `order_id`, `product_id`, `customer_name`, `serving_style` (`eat-in`, `take-away`), `price`.
* **`customers`**: `id`, `phone_number`, **`loyalty_points_balance`**. (Identify users by phone number for rewards).
* **`service_requests`**: `id`, `table_id`, `request_type` (napkins, water, bill, assistance), `status` (pending/resolved).

---

## **3. Feature-Specific Logic & Integration**

### **A. Digital Show-Glass Manager (Real-Time Control)**
* **The Logic:** Provide a "Manager Dashboard" in React. When the show-glass runs low, the manager toggles an item.
* **Integration:** Toggling an item triggers a `ProductStatusUpdated` event in Laravel, which Reverb broadcasts to all active customer menus. The item gray-out happens instantly without a page refresh.

### **B. AI-Powered Upselling (The "Nudge")**
* **The Logic:** Use a simple association algorithm. When a user adds "Jollof Rice," the backend checks for items tagged as "Proteins" that are currently `instock` in the show-glass.
* **Integration:** On the "Add to Cart" modal, display a "Goes well with..." section showing 2-3 available proteins or drinks.

### **C. The "Call Waiter" Digital Bell**
* **The Logic:** A floating action button (FAB) on the customer’s React UI. 
* **Integration:** Pressing the button creates a record in `service_requests`. Laravel Reverb pushes a "Ping" notification to the **Staff App** (with a sound alert), identifying exactly which table needs help and what they need.

### **D. Forahia Rewards (Loyalty Points)**
* **The Logic:** At checkout, the user enters their phone number to "Claim Points." 
* **Integration:** * 10% of the total order value is converted to points.
    * Points are stored in the `customers` table.
    * On future orders, if the balance is high enough, the React frontend offers a "Pay with Points" discount option.

---

## **4. Developer Guidelines**

### **For Backend Developers (Laravel)**
1.  **Signed QR Routes:** Use `URL::temporarySignedRoute` for QR codes to prevent remote ordering from outside the building.
2.  **Observer Pattern:** Use Laravel Observers on the `Order` model. When `status` changes to 'Paid', automatically fire the logic to increment Loyalty Points and alert the Kitchen.
3.  **Manual Payment Verification:** Create a specialized `Middleware` for the Staff App so only verified employees can "Approve" bank transfers.

### **For Frontend Developers (React + Inertia)**
1.  **The Group Cart:** Use a "Cart Item" component that requires a `customer_name` and `serving_style` before it can be added. 
2.  **Real-time KDS:** The Kitchen Display System must be a "Long Polling" or "WebSocket" view. Use **Tailwind's Animate-Pulse** for orders that have been waiting longer than 15 minutes.
3.  **The "Ready" Notification:** When an order status becomes `ready`, use the Browser Notification API to ping the customer’s phone, even if they have the tab minimized while chatting.

---

## **5. The "Anti-Rowdy" Workflow (Final Polish)**
* **Step 1:** Group at Table 5 scans. Each person enters their name.
* **Step 2:** They order. One person wants "Take-away" (packaged), others want "Dine-in" (plated).
* **Step 3:** Waiter sees the consolidated order: *"Table 5: 3 Plates, 1 Bag."*
* **Step 4:** Waiter arrives at the table. The app tells the waiter: *"Bag is for Chijindu."*
* **Step 5:** No shouting. No confusion.

This is now a complete, enterprise-grade strategy. Your developers can use this as their primary documentation for the Sprint.

---

## **6. Implementation Tracking Schedule**

### **Phase 1: Environment & Architecture Setup**
- [x] Configure Database (PostgreSQL - `serve_ease`)
- [x] Initialize Framework (Laravel 13.x standard architecture + Inertia.js)
- [x] Integrate Frontend Build System (React + Vite + Tailwind CSS)
- [x] Set Up Modern PHP Principles (Idempotency, Global N+1 query prevention)

### **Phase 2: Database Schema & Migrations**
- [x] Stub core Models & Factories (Table, Product, Order, OrderItem, Customer, etc.)
- [x] Define Migration columns, UUID traits, and Database constraints
- [x] Configure Eloquent Model Relationships
- [x] Finalize `public` schema permissions & migrate database successfully

### **Phase 3: Frontend UIs (DreamsPOS Aesthetics)**
- [x] Initialize Unified Base Layouts & Assets matching DreamsPOS
- [x] Customer QR Menu Interface (Mobile-optimized)
- [x] KDS (Kitchen Display System) UI Board
- [x] Manager Show-Glass toggle UI (Inventory Management)
- [x] "Call Waiter" Floating Action Button (FAB)

### **Phase 4: Core Logic Integrations**
- [x] "Call Waiter" WebSockets & Alerts (Laravel Reverb + Echo)
- [x] Dynamic Show-Glass backend toggling logic & Broadcasting
- [x] AI-Powered "Nudge" Upselling logic on Order additions
- [x] Cart item grouping by `customer_name` and `serving_style`
- [x] **Branding & Assets**
    - [x] Custom Logo Design (Minimalist, modern).
    - [x] Favicon Implementation across all views.
- [x] **Premium Auth Flow (Entry Point)**
    - [x] Removed Landing Page; App now leads directly to Login.
    - [x] Implemented **Split-Screen Layout** (Professional Branding Left, Form Right).
    - [x] Restricted Access: Removed public-facing Register link.
    - [x] Refactored Login, Register, and Forgot Password UIs with bold enterprise styling.

### **Phase 5: Payments & Loyalty Logic**
- [ ] Integrate local mock or actual Paystack/Flutterwave workflows
- [ ] Automated Loyalty Points attribution Observer
- [ ] Verify Waiter/Manager manual payment approval pipeline
