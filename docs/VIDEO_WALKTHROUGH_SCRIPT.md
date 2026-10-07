# Roomly Frontend Walkthrough (6–8 minutes)

Record the deployed frontend at https://roomly-frontend-three.vercel.app. Use Loom or
OBS Studio to capture the browser and narration. Avoid showing password managers,
environment variables, or private account information.

## Before recording

- Confirm the Roomly backend health endpoint responds and its Render service is live.
- Confirm the Render service has `CLIENT_URL=https://roomly-frontend-three.vercel.app`.
- Confirm the Vercel production project has `NEXT_PUBLIC_API_URL` and
  `NEXT_PUBLIC_APP_URL` configured.
- Use the seeded demo accounts from Assessment 6:
  - Admin: `admin@roomly.com`
  - Landlord: `landlord.demo@roomly.com`
  - Tenant: `tenant.demo@roomly.com`
- Keep passwords out of the recording; use the one-click demo buttons.
- Complete a real sandbox booking and payment beforehand, if a confirmed demo booking
  and working SSLCommerz sandbox credentials are available.

## 0:00–0:40 — Introduction

Open the production URL and say:

> “This is Roomly, a housing and roommate platform. The frontend is deployed on
> Vercel and consumes the Assessment 6 API. It has separate Admin, Landlord, and
> Tenant experiences, with booking requests and SSLCommerz sandbox checkout.”

Point out the responsive navigation and explain that listing and dashboard content is
loaded from the backend rather than local sample data.

## 0:40–1:20 — Authentication and route protection

Open `/login`. Show the three separate Demo Login buttons, then sign in as Tenant.
Show the tenant dashboard. In a private browser window, open `/admin` without a
session and show that middleware redirects to login. If available, repeat the demo
login for Admin and Landlord and show their role-specific navigation.

Say:

> “The browser keeps the access token for authenticated API calls. Middleware checks
> the token with the backend’s `/auth/me` endpoint and routes each role to its own
> dashboard.”

## 1:20–2:10 — Live listings and URL filters

Open `/services`. Search for a location or title, set a rent range, choose a room
type, and change the bedroom filter. Point to the URL as filters change. Show the
empty state by choosing a range/location with no matches, then clear it.

Open a result’s details and show the backend-provided title, location, amenities,
rent, and host information.

## 2:10–3:00 — Booking request

On a listing detail page, select a future move-in date, optionally add a message,
and submit a booking request as Tenant. Show the success notification and then the
new request in `/dashboard`.

Say:

> “The request is validated in the browser and submitted to the booking API. A
> tenant cannot start payment until the landlord confirms the booking.”

## 3:00–3:50 — Landlord workflow

Use the Landlord Demo Login button. Show published listings, live landlord totals,
and pending booking requests. Confirm a request and show the updated status.
Open Earnings and point out that figures and transactions come from landlord
statistics and payment-history endpoints.

## 3:50–4:50 — SSLCommerz sandbox payment

Sign in as the Tenant who owns a confirmed booking. Choose Pay rent or Pay deposit.
Show that the app sends a payment-initiation request and redirects to the real
SSLCommerz sandbox checkout; do not describe a manual status toggle as a payment.
Complete the sandbox payment only with test credentials approved for this backend.
Show the return to the payment-result page and then the backend-confirmed transaction
in Payment History.

If sandbox credentials or a confirmed booking are unavailable, explain that the
checkout handoff is integrated but do not claim a successful transaction.

## 4:50–5:40 — Admin operations

Use the Admin Demo Login button. Show live platform totals, then open user
management. Demonstrate search/role filters, blocking or unblocking a non-admin
account, and landlord verification where an unverified landlord is available.
Open Reports to show paginated backend audit-log events.

## 5:40–6:20 — Profile, responsive layout, and close

Open a role profile page, update a harmless field, save it, and show the success
feedback. Resize to a narrow viewport and point out the responsive cards, forms,
and navigation.

Close with:

> “Roomly now connects its role dashboards, listings, booking flow, profile
> management, payment history, and SSLCommerz checkout to the real backend. The
> production frontend is live on Vercel; backend availability depends on the
> configured database and gateway services.”
