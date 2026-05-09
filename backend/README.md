# JIV Tutoring — Backend API

Production-grade Node.js + Express backend built with **Domain Driven Design (DDD)**.

## Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Email:** Nodemailer (Gmail SMTP)
- **Validation:** Joi
- **Auth:** JWT (admin only)
- **News:** NewsAPI.org with cached fallback

## Folder Structure (DDD)

```
src/
├── domains/                 # Pure business logic (no framework imports)
│   ├── booking/
│   │   ├── entities/        # Booking, Student
│   │   ├── value-objects/   # TimeSlot, ContactInfo
│   │   ├── repositories/    # BookingRepository
│   │   └── services/        # BookingService
│   ├── parent/
│   ├── notification/        # Email + News services
│   ├── scheduling/          # Availability, slot generation
│   └── admin/               # Auth
│
├── application/             # Use cases — orchestrate domains
│   └── use-cases/
│       └── CreateBookingUseCase.js
│
├── infrastructure/          # External concerns
│   ├── database/            # Mongoose models + connection
│   ├── email/               # Nodemailer transporter
│   └── middleware/
│
├── interfaces/              # HTTP layer
│   └── http/
│       ├── routes/
│       ├── controllers/
│       ├── validators/
│       └── middleware/
│
├── shared/                  # Cross-cutting concerns
│   ├── errors/
│   └── logger/
│
├── app.js                   # Express setup
└── server.js                # Entry point
```

## Setup

```bash
cd backend
cp .env.example .env       # Then edit values
npm install
npm run dev
```

The server boots on **http://localhost:5000** and:
- Connects to MongoDB
- Auto-seeds a default super-admin (`info@jivtutoring.com` / value from `ADMIN_DEFAULT_PASSWORD`)
- Auto-seeds Mon–Sat availability (08:00–18:00)

## API Endpoints

### Public
| Method | Path                              | Description                              |
|--------|-----------------------------------|------------------------------------------|
| GET    | `/health`                         | Health check                             |
| POST   | `/api/bookings`                   | Create a booking (free trial)            |
| GET    | `/api/bookings/:id`               | Get a booking by ID                      |
| POST   | `/api/contact`                    | Send contact message                     |
| GET    | `/api/news`                       | Education news (with fallback)           |
| GET    | `/api/schedule/available?date=`   | Available time slots for a date          |
| POST   | `/api/auth/login`                 | Admin login                              |

### Protected (Bearer token)
| Method | Path                                       | Description              |
|--------|--------------------------------------------|--------------------------|
| GET    | `/api/admin/bookings`                      | List bookings (filters)  |
| GET    | `/api/admin/stats`                         | Booking statistics       |
| PATCH  | `/api/admin/bookings/:id/approve`          | Approve booking          |
| PATCH  | `/api/admin/bookings/:id/reject`           | Reject booking           |
| PATCH  | `/api/admin/bookings/:id/complete`         | Mark complete            |
| PATCH  | `/api/admin/bookings/:id/cancel`           | Cancel booking           |
| GET    | `/api/schedule/availability`               | List availability        |
| POST   | `/api/schedule/availability`               | Set availability         |

## Email Behavior

When a parent submits a booking, the server sends **two** emails in parallel:
1. To **admin** (`info@jivtutoring.com`) — full booking details
2. To **parent** — confirmation with summary

Both are also visible in the admin dashboard.

## Business Rules Enforced
- ✅ Group sessions: 2–5 students only
- ✅ Individual sessions: exactly 1 student
- ✅ Auto group discount (10% / 15% / 20% / 25%)
- ✅ Double-booking prevention via DB index + repository check
- ✅ Future date validation
- ✅ Kenyan phone format validation
