# JIV Tutoring Services — Full-Stack Web Platform

A production-ready online tutoring & homeschooling platform for Kenyan families.
Built with **Next.js + Node.js (DDD) + MongoDB**, designed in a premium
**Blue + Yellow** theme inspired by the brand flyer.

> **Founder & Lead Educator:** Joan Theresa
> **Team:** A collective of certified, caring teachers led by Joan
> **Curricula:** CBC + IGCSE
> **Contact:** +254 726 555 444 · joantheresa26@gmail.com

---

## 📁 Project Structure

```
jiv-tutoring/
├── backend/              # Node.js + Express + DDD + MongoDB
│   ├── src/
│   │   ├── domains/      # booking, parent, notification, scheduling, admin
│   │   ├── application/  # Use cases
│   │   ├── infrastructure/  # DB, email, middleware
│   │   ├── interfaces/   # HTTP routes/controllers
│   │   └── shared/       # Errors, logger
│   ├── .env.example
│   └── package.json
│
├── frontend/             # Next.js 14 + Tailwind + SEO
│   ├── src/
│   │   ├── app/          # Home, About, What We Do, News, Contact, Book, Admin
│   │   ├── components/   # Navbar, Footer, WhatsApp button
│   │   └── lib/          # API client
│   ├── .env.example
│   └── package.json
│
└── README.md             # ← You are here
```

---

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env       # ← Fill in EMAIL_PASS, NEWS_API_KEY, etc.
npm install
npm run dev                # Starts on http://localhost:5000
```

### 2. Frontend (in a new terminal)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                # Starts on http://localhost:3000
```

### 3. Visit
- **Public site:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login
   - Default email: `joantheresa26@gmail.com`
   - Default password: from `ADMIN_DEFAULT_PASSWORD` in `.env`
- **API health:** http://localhost:5000/health

---

## ✨ Key Features

### For Parents (Public Site)
- Book a **FREE 45-minute trial** in under 2 minutes
- Choose Individual or Group sessions (2–5 students, auto-discount 10–25%)
- CBC or IGCSE curriculum support
- Educational news feed with graceful fallback ("News will be here soon...")
- WhatsApp floating button, contact form, full mobile responsiveness

### For Admin (Dashboard)
- View all bookings with filters (status / curriculum / session type)
- Approve, reject, complete, or cancel bookings
- Statistics overview (total / pending / approved / completed)
- Secured with JWT authentication

### Email System
Every booking automatically triggers **two parallel emails**:
1. To **`joantheresa26@gmail.com`** — full booking details
2. To **the parent** — confirmation with summary

Both use a branded HTML template (Blue + Yellow gradient).

### SEO
- ✅ Server-side rendered pages
- ✅ schema.org `EducationalOrganization` JSON-LD
- ✅ Auto-generated `sitemap.xml` + `robots.txt`
- ✅ OpenGraph + Twitter cards
- ✅ Targeted keywords: "homeschooling Kenya", "online tutoring CBC", "IGCSE tutor Kenya"
- ✅ Optimized fonts and images

---

## 🏛️ Architecture

### Backend — Domain Driven Design
| Layer            | Purpose                                                  |
|------------------|----------------------------------------------------------|
| **Domain**       | Pure business logic — entities, value objects, services  |
| **Application**  | Use cases that orchestrate multiple domains              |
| **Infrastructure**| External concerns — MongoDB, Nodemailer                  |
| **Interface**    | HTTP — Express routes, controllers, validators           |

**Domains:**
- `booking` — Booking, Student entities; TimeSlot, ContactInfo VOs
- `notification` — Email + News services with templates
- `scheduling` — Availability + slot generation
- `admin` — JWT auth
- `parent` — Parent aggregate (extensible)

### Frontend — Next.js App Router
- All public pages are **statically rendered** for SEO + performance
- Booking, contact, news, admin pages are **client components** that talk to the API
- Tailwind theme defined in `tailwind.config.js` matches the flyer exactly
   - `navy.*` deep blues from the flyer background
   - `gold.*` yellows for accents and CTAs

---

## 📊 Database Schema (MongoDB)

### `bookings`
```js
{
  bookingId: "uuid",
  parent: { fullName, email, phone },
  students: [{ name, age, gradeOrClass, learningChallenges }],
  sessionType: "INDIVIDUAL" | "GROUP",
  curriculum: "CBC" | "IGCSE",
  subjects: ["Math", "English", ...],
  scheduledDate: ISODate,
  timeSlot: { startTime, endTime, durationMinutes },
  notes: "string",
  isFreeTrialed: true,
  discountPercentage: Number,
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED",
  createdAt, updatedAt
}
```

### `admins`
```js
{ email, passwordHash, name, role, lastLogin }
```

### `availability` & `blockedslots`
```js
// availability
{ dayOfWeek: 0-6, startTime, endTime, isActive }
// blockedslots
{ date, startTime, reason }
```

---

## 🔌 API Endpoints

### Public
- `POST /api/bookings` — create a booking (sends emails)
- `GET  /api/bookings/:id` — fetch a booking
- `POST /api/contact` — send contact message
- `GET  /api/news` — get education news (with cached fallback)
- `GET  /api/schedule/available?date=YYYY-MM-DD` — available time slots
- `POST /api/auth/login` — admin login

### Protected (Bearer token)
- `GET   /api/admin/bookings` — list bookings (filters)
- `GET   /api/admin/stats` — booking statistics
- `PATCH /api/admin/bookings/:id/approve|reject|complete|cancel`
- `GET   /api/schedule/availability`
- `POST  /api/schedule/availability` — set day availability

---

## 🎨 Design Tokens

Inspired directly by the reference flyer:
| Token            | Hex       | Usage                            |
|------------------|-----------|----------------------------------|
| `navy.950`       | `#030b27` | Deepest background tones         |
| `navy.800`       | `#0a1f5a` | Primary brand background         |
| `navy.500`       | `#1e40af` | Mid-blue gradient stop           |
| `gold.400`       | `#fbbf24` | Primary CTA / accent             |
| `gold.500`       | `#f59e0b` | Hover states                     |
| `gold.300`       | `#fcd34d` | Subtle highlights / text on dark |

Hero gradient: `linear-gradient(135deg, #030b27 → #0a1f5a → #173592)`
CTA gradient: `linear-gradient(135deg, #fbbf24 → #f59e0b)`

---

## 📦 Production Deployment

### Backend (Railway, Render, Heroku, Fly.io)
1. Set all env vars from `.env.example`
2. Use a real Gmail App Password for `EMAIL_PASS`
3. Use a strong `JWT_SECRET` and `ADMIN_DEFAULT_PASSWORD`
4. Point `MONGODB_URI` to a managed MongoDB (Atlas)

### Frontend (Vercel, Netlify)
1. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain
3. Build command: `npm run build`
4. Output: `.next/`

---

## 📝 License & Credits
© 2026 JIV Tutoring Services · Built with care for Kenyan families.
