# Roomly — Housing & Roommate Platform

A production-ready, full-stack housing platform for finding rooms, managing properties, and connecting roommates across Dhaka, Bangladesh.

---

## 🌐 Live Demo

**Frontend:** _Deploy URL here_  
**Backend API:** `https://b7a6.onrender.com/api/v1`

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@roomly.com` | `Admin123!` |
| Tenant | `tenant.demo@roomly.com` | `Tenant123!` |
| Landlord | `landlord.demo@roomly.com` | `Landlord123!` |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark mode via `next-themes`)
- **State / Data fetching:** TanStack Query v5, Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Charts:** Recharts
- **UI Components:** Radix UI primitives, Lucide React icons
- **Payments:** SSLCommerz (via backend redirect)
- **Realtime:** Socket.IO client (notifications)
- **Toasts:** Sonner

### Backend (Assessment 6)
- **Runtime:** Node.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase / Render)
- **Auth:** JWT (access + refresh tokens, HttpOnly cookies)
- **File uploads:** Cloudinary
- **Payments:** SSLCommerz

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd roomly-frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://b7a6.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home (12 sections)
│   ├── about/              # About page
│   ├── blog/               # Blog listing page
│   ├── contact/            # Contact page with form
│   ├── pricing/            # Pricing tiers
│   ├── services/           # Listings explore + detail
│   ├── login/              # Auth: login
│   ├── register/           # Auth: register
│   ├── dashboard/          # Tenant dashboard (6 pages)
│   ├── provider/           # Landlord dashboard (5 pages)
│   └── admin/              # Admin dashboard (6 pages)
├── components/             # Shared React components
│   ├── site-navbar.tsx     # Sticky responsive navbar
│   ├── site-footer.tsx     # Full footer
│   ├── dashboard-shell.tsx # Dashboard layout + profile dropdown
│   ├── ai-chatbot.tsx      # AI chat assistant widget
│   ├── ai-search-suggestions.tsx  # AI-powered search suggestions
│   ├── newsletter-form.tsx # Email subscribe form
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   └── ...
├── lib/
│   ├── api.ts              # All API calls (typed)
│   ├── auth.ts             # Auth helpers
│   └── format.ts           # Currency/date formatters
└── providers/
    ├── query-provider.tsx  # TanStack Query
    └── theme-provider.tsx  # next-themes dark mode
```

---

## ✨ Features

### 🌙 UI & Design
- Light / dark mode with full contrast support
- 3-color system: Indigo (primary), Teal (accent), Slate (neutral)
- Consistent card sizing, border-radius, and spacing throughout
- Fully responsive — mobile, tablet, desktop
- Skeleton loaders on all data-fetched sections

### 🏠 Home Page (12 sections)
1. Hero with live featured listing
2. Stats banner
3. Category browse (Entire Place, Private Room, Shared Room, Near University)
4. Featured live listings (4-per-row)
5. How It Works (4 steps)
6. Platform features (6 cards)
7. Popular neighborhoods (clickable chips)
8. Testimonials (3 user reviews)
9. FAQ (5 questions)
10. For Landlords CTA
11. Newsletter subscribe
12. Final CTA banner

### 🧭 Navigation
- **Sticky site navbar** with 6 routes, profile dropdown (logged in), dark mode toggle, mobile hamburger
- **Full footer** with link columns, social icons, contact info

### 🔐 Authentication
- Login with email/password + validation
- Demo login buttons (Admin / Tenant / Landlord one-click)
- Register with Google/Facebook UI, password visibility toggle, radio role selector, loading spinner
- JWT access tokens with automatic refresh

### 📋 Listings
- 4-per-row grid on desktop
- Search with **AI-powered suggestions dropdown**
- Sort: newest / oldest / price asc / price desc
- Filter panel: city, min rent, max rent, type, bedrooms
- Active filter count badge + clear filters
- Pagination

### 📄 Public Pages
| Page | Description |
|------|-------------|
| About | Mission, values, timeline, team, stats |
| Contact | Validated form (name, email, category, subject, message) with success state |
| Blog | Featured post, 5 articles, category filters, newsletter |
| Pricing | 3-tier plans with feature lists |

### 🗂 Dashboards (Role-Based)

#### Tenant Dashboard (6 pages)
- Activity overview (booking stats, payment total)
- Saved homes
- Roommate matching hub
- Profile editor
- Payment history
- Notifications

#### Landlord Dashboard (5 pages)
- Property overview (stats + pending bookings)
- Listings management (create/edit/delete)
- Earnings
- Profile
- Notifications

#### Admin Dashboard (6 pages)
- Platform overview (charts: user distribution, listings vs bookings)
- Manage users (block/unblock, verify landlord)
- Reports (audit log)
- Notifications
- All listings (filterable table)
- Audit log (paginated action history)

**All dashboards include:**
- Profile dropdown with role badge, Profile link, Logout
- Dark mode toggle
- Responsive sidebar navigation

### 🤖 AI Features
1. **AI Chatbot Assistant** — floating chat bubble on every page; answers FAQs about booking, payment, roommate matching, listing; typing indicator; quick reply chips
2. **AI Smart Search Suggestions** — suggestions dropdown on the listings search bar showing trending neighborhoods and AI-picked queries as you type

### 💳 Payments
- SSLCommerz integration (booking advance + security deposit)
- Payment history table in tenant dashboard
- Earnings breakdown in landlord dashboard

---

## 🔗 GitHub Repositories

- **Frontend:** _this repo_
- **Backend (Assessment 6):** _link here_

---

## 👤 Author

**HinataHamura** — [usercse420@gmail.com](mailto:usercse420@gmail.com)
