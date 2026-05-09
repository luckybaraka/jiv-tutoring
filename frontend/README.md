# JIV Tutoring — Frontend

A production-ready Next.js 14 (App Router) frontend with Tailwind CSS,
SEO optimization, and a premium Blue + Yellow theme inspired by the brand flyer.

## Tech Stack
- **Framework:** Next.js 14 (App Router, RSC, Server Rendering for SEO)
- **Styling:** Tailwind CSS with custom navy/gold theme
- **Icons:** lucide-react
- **Notifications:** react-hot-toast
- **Fonts:** Inter + Plus Jakarta Sans (Google Fonts)

## Pages
| Route             | Description                                       |
|-------------------|---------------------------------------------------|
| `/`               | Homepage — hero, services, testimonials, CTA      |
| `/about`          | About the team, led by Joan Theresa               |
| `/what-we-do`     | Services, curricula (CBC + IGCSE), subjects       |
| `/news`           | Learning news — fetches from backend with fallback|
| `/contact`        | Contact form + direct contact details             |
| `/book`           | Multi-step booking wizard (under 2 minutes)       |
| `/admin/login`    | Admin login                                       |
| `/admin/dashboard`| Admin booking management dashboard                |

## Setup

```bash
cd frontend
cp .env.example .env.local       # Edit if needed
npm install
npm run dev
```

The site boots on **http://localhost:3000** and talks to the backend at
**http://localhost:5000/api**.

## SEO Features
- ✅ Server-side rendering (default with App Router)
- ✅ Per-page metadata (title, description, OpenGraph, Twitter)
- ✅ schema.org `EducationalOrganization` JSON-LD on all pages
- ✅ `sitemap.xml` and `robots.txt` auto-generated
- ✅ Optimized fonts (preconnected Google Fonts)
- ✅ Targeted keywords: "homeschooling Kenya", "online tutoring CBC", "IGCSE tutor Kenya"
- ✅ Mobile-first responsive design
- ✅ Sticky CTAs and trust signals

## News Page Fallback Behavior

The `/news` page calls the backend `/api/news` endpoint:
1. If the backend returns articles (live or curated fallback) → they render normally.
2. If the backend is unreachable → an inline message is shown:
   *"News will be here soon — we're currently having trouble fetching the
   latest education news from our servers. Please check again in a few minutes."*
   along with a **Try Again** button.

## Booking Flow
The booking wizard has **4 steps** + a success screen:
1. **Session Type & Curriculum** — Individual or Group (2–5), CBC or IGCSE
2. **Parent Details** — Name, email, Kenyan phone (validated)
3. **Students & Subjects** — Up to 5 students, multi-select subjects
4. **Schedule** — Date + time slot + optional notes

Group sessions get an **automatic discount** preview (10/15/20/25% based on size).
On submit, a POST to `/api/bookings` triggers parallel emails to:
- The admin (`joantheresa26@gmail.com`)
- The parent
