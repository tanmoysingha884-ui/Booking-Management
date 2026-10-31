# 🌴 Goa Resort — Luxury Beachfront Booking System

A fullstack 5-star hotel booking application for **Goa Resort** in Candolim, North Goa. Built with modern web development best practices, luxury aesthetics, animations, role-based authentication, and a complete admin management console.

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React 19** (Vite build)
  - **Tailwind CSS** (Custom luxury color palette: Gold, Ocean Deep Teal, Sand)
  - **JavaScript** (ESM)
  - **Framer Motion** (Smooth transitions, modals, interactive effects)
  - **Lucide React** (Modern iconography)
  - **Axios** (API client with automatic JWT token attachment)

- **Backend**:
  - **Node.js** & **Express.js**
  - **MongoDB** & **Mongoose**
  - **JWT (JSON Web Tokens)** for role-based authentication
  - **Bcrypt.js** for password hashing
  - **Multer & Cloudinary** for cloud image upload handling
  - **CORS** & **Dotenv**

---

## 🌟 Key Features

### 1. Luxury Navbar & Header
- **Branding**: "GOA RESORT — 5-STAR LUXURY, Candolim Beach, Goa"
- **5 Primary Navigation Options**:
  1. `Home` (`#home`)
  2. `Rooms` (`#rooms`)
  3. `Gallery` (`#gallery`)
  4. `About Us` (`#about`)
  5. `Contact` (`#contact`)
- **Right-side Authentication**:
  - When logged out: Prominent **"Sign In"** button with gold glow.
  - When logged in: Displays **User Avatar / Image** with user name & role badge.
  - Interactive profile dropdown:
    - **Admin Dashboard** (available for Admin users)
    - **My Bookings** (view and manage guest reservations)
    - **Sign Out**

### 2. Interactive Booking Flow
- **Hero Availability Bar**: Check-in, check-out date picker, guest selection, and room category filter.
- **Room Listings**: Real-time filtering by category, search keywords, and price sorting.
- **Room Details Modal**: High-res multi-angle photo gallery, bed specs, horizon view, square footage, and amenities checklist.
- **Reservation Modal**: Automatic night calculation, 12% Goa Luxury GST breakdown, special guest requests, online card / pay-at-check-in preference, and instant booking confirmation with unique Reference ID (`GOA-XXXXXX`).

### 3. Photo Gallery & Lightbox
- High-resolution showcase of Goa Resort beachfront, private villas, suites, dining, and infinity pools.
- Category tabs: `Beach`, `Suites`, `Dining`, `Spa & Pool`, `Sunset & Vibe`.
- Fullscreen Lightbox modal on photo click with captions and high-resolution view.

### 4. About Us & Story
- Indo-Portuguese architectural heritage narrative on Candolim Beach.
- 4 Pillars of Excellence: Pristine Beachfront, Epicurean Dining, Ayurvedic Spa, Sussegado Hospitality.
- Resort metrics: 150+ Beachfront Keys, 4 Signature Venues, 2 Infinity Pools, 99.4% Satisfaction.

### 5. Contact & Inquiry System
- Direct inquiry form connected to `/api/contact`.
- Resort concierge details: Phone (+91 98221 44550), WhatsApp, direct emails, and airport distance calculator.

### 6. Admin Dashboard Panel
Complete control panel that manages all frontend data:
- **Analytics Overview**: Live Revenue in ₹, Total Bookings, Active Rooms, Unread Inquiries, Occupancy Rate %.
- **Rooms Management**: Table of rooms, Add New Room modal, Edit Room details, Delete Room.
- **Bookings Management**: Table of all reservations, change status (`Confirmed`, `Pending`, `Completed`, `Cancelled`), view guest contacts and requests.
- **Gallery Management**: Add new photo with category and image URL, delete photos.
- **Inquiries / Messages**: Review contact form submissions, mark as Read / Replied.
- **Quick Switch**: One-click button to jump between Admin Dashboard and public resort website.

---

## 🔑 Default User Accounts

Quick login buttons are available in the Sign In modal:

| Role | Email | Password | Privileges |
|------|-------|----------|------------|
| **Admin** | `admin@goaresort.com` | `admin123` | Full Admin Console (CRUD Rooms, Bookings, Gallery, Inquiries) |
| **Guest** | `guest@example.com` | `guest123` | Room reservations, My Bookings management |

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates initial Goa Resort rooms, gallery, admin & guest accounts
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```
