# 🏥 Clinexa — Healthcare Booking Platform

> Your trusted platform for finding doctors, booking appointments, and managing blood bank requests — all in one place.

---

## 📌 About the Project

**Clinexa** is a full-stack healthcare booking web application built with React + TypeScript + Supabase. It enables patients to discover verified doctors by specialization, book appointments in real time, and interact with emergency blood bank services.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Doctor Discovery** | Search and filter doctors by specialization, rating, and location |
| 📅 **Appointment Booking** | Book real-time appointments with available time slots |
| 🩸 **Blood Bank** | Submit & respond to emergency blood donation requests |
| 👨‍⚕️ **Doctor Dashboard** | Doctors can manage their schedule and view patient appointments |
| ⭐ **Patient Reviews** | Read and submit verified reviews for doctors |
| 🔐 **Auth System** | Secure login & registration powered by Supabase Auth |
| 💳 **Payment Selection** | Choose from multiple payment options at checkout |
| 🎠 **Hero Carousel** | Dynamic homepage carousel highlighting platform features |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Realtime) |
| **State** | TanStack React Query |
| **Forms** | React Hook Form + Zod |
| **Routing** | React Router DOM v6 |
| **Maps** | Mapbox GL |
| **Charts** | Recharts |
| **Animations** | Tailwind Animate, Embla Carousel |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── HeroCarousel.tsx
│   ├── EmergencyRequestCard.tsx
│   ├── DonorProfileSetup.tsx
│   ├── PaymentSelection.tsx
│   ├── ReviewCard.tsx
│   └── ...
├── pages/               # Application pages / routes
│   ├── Index.tsx        # Landing / Home page
│   ├── Auth.tsx         # Login & Register
│   ├── Doctors.tsx      # Doctor listing & search
│   ├── DoctorDetail.tsx # Individual doctor profile
│   ├── Appointments.tsx # Patient appointment management
│   ├── DoctorDashboard.tsx # Doctor's admin view
│   └── BloodBank.tsx    # Blood bank & emergency requests
├── integrations/
│   └── supabase/        # Supabase client & type definitions
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
supabase/
└── migrations/          # Database schema migrations
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/devyanshujasud-ai/healthcare.git

# 2. Navigate to the project directory
cd healthcare

# 3. Install dependencies
npm install

# 4. Set up environment variables
# Create a .env file and add your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:8080**

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🗄️ Database

This project uses **Supabase** as the backend. The database schema is managed via migrations located in `supabase/migrations/`. Tables include:

- `specializations` — Medical specialties (Cardiology, Neurology, etc.)
- `doctors` — Doctor profiles, ratings, and availability
- `appointments` — Patient-doctor appointment records
- `blood_requests` — Emergency blood donation requests
- `reviews` — Patient reviews for doctors

---

## 🌐 Pages & Routes

| Route | Page |
|---|---|
| `/` | Home / Landing Page |
| `/auth` | Login & Register |
| `/doctors` | Browse & filter doctors |
| `/doctors/:id` | Doctor detail & booking |
| `/appointments` | My Appointments (patient) |
| `/doctor-dashboard` | Doctor management panel |
| `/blood-bank` | Blood bank & emergency requests |

---

## 📊 Platform Stats

- 👨‍⚕️ **500+** Expert Doctors
- ⭐ **4.8/5** Average Rating
- 📅 **50k+** Appointments Booked
- 🏥 **20+** Medical Specializations

---

## 🔒 Security

- Authentication is handled by **Supabase Auth** (email/password)
- All API calls are protected via Row Level Security (RLS) policies in Supabase
- Sensitive credentials are stored in `.env` (never committed to version control)

---

## 📄 License

This project is private and intended for development purposes.

---

> © 2025 **Clinexa** — Your trusted healthcare booking platform.
