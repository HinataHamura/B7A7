# Roomly Frontend Walkthrough (7–9 minutes)

Record the production frontend at <https://roomly-frontend-three.vercel.app> with
Loom or OBS. Capture the browser and narration. Use a clean browser profile and a
readable desktop viewport; briefly switch to a mobile-width viewport during the
responsive-design section. Do not show passwords, password managers, environment
variables, private account information, or payment credentials.

## Before recording

- Check that <https://b7a6.onrender.com/health> reports a healthy backend and that
  the production site can load `/services`.
- Confirm the current production deployment at
  <https://roomly-frontend-three.vercel.app>.
- Use the one-click demo buttons on `/login` for Admin, Tenant (shown as “User”),
  and Landlord (shown as “Provider”). Do not put demo passwords in the video.
- Use only demo accounts and disposable/test data. Do not block a real user, alter
  a real listing, or complete a payment with non-test credentials.
- Prepare one available listing and a future move-in date if you plan to demonstrate
  booking. Submit a booking only if the demo account does not already have an active
  request for that listing.
- A sandbox payment requires a confirmed demo booking and working SSLCommerz test
  credentials. If either is unavailable, show the checkout button/handoff only if
  safe to do so, and clearly say the payment was not completed.
- A review can only be submitted for a completed booking. Do not change a booking
  to completed just to create video content.
- Three Unsplash images are used as **illustrative** room interiors where a listing
  has no owner-uploaded photo. The UI labels these “Illustrative · Unsplash · actual
  room may differ”. State this clearly; do not present these images as photos of
  the actual listed homes. Landlords can upload actual listing photos in listing
  management.

## 0:00–0:35 — Introduction

Open the home page and say:

> “This is Roomly, a housing and roommate platform. The Next.js frontend is deployed
> on Vercel and connects to the Assessment 6 backend. The app supports Tenant,
> Landlord, and Admin roles, live listings, bookings, and SSLCommerz payment
> initiation.”

Point out that the home page’s featured home and published-home count come from the
live listing API. If a representative image appears, explain that it is illustrative
and not a photo of that specific property.

## 0:35–1:20 — Login and role-specific dashboards

Open `/login` and show the three one-click demo login options. Sign in as Tenant and
show the dashboard navigation: Activity, Saved homes, Roommates, Profile, Payments,
and Notifications. Briefly open `/admin` in a logged-out/private browser window to
show the login redirect. If time permits, use the other demo buttons to show that
Admin and Landlord have their own dashboard routes and navigation.

Say:

> “The one-click demo accounts make each role easy to evaluate. Middleware uses the
> session role to protect dashboard routes and redirect users to the appropriate
> area. The backend separately enforces authorization on API requests.”

Do not describe the role cookie itself as a signed authorization credential.

## 1:20–2:10 — Listings, filters, and photo disclosure

Open `/services`. Search by title or area, try a city and rent range, then select a
room type and bedroom count. Point out that the filters and pagination are reflected
in the URL. Show an empty result state only if it can be reached without disturbing
the rest of the walkthrough.

Open a listing. Show the live rent, address, room details, amenities, host
verification (if present), reviews, and booking request form. If the image is marked
illustrative, say:

> “This is a representative Unsplash interior, not a photograph of the actual
> property. Owner-uploaded listing photos take precedence when available.”

If demonstrating landlord image upload later, explain that it uploads the selected
image to the configured image service and saves its URL with the listing.

## 2:10–2:55 — Booking request

As Tenant, choose a future move-in date and submit a booking request only when the
demo account has no active request for that listing. Show the success feedback and
the request on `/dashboard`.

Say:

> “The booking form validates the move-in date and message, then sends the request to
> the backend. The landlord must confirm it before rent or deposit checkout can be
> initiated. A tenant can withdraw a still-pending request.”

If an active booking already exists or the demo API is unavailable, show the existing
booking/status instead. Do not create repeated requests to force the demo.

## 2:55–3:40 — Landlord operations and photo uploads

Use the Landlord/Provider demo login. Show live listing and booking totals, the
listing inventory, and pending booking actions. Confirm or decline only a disposable
demo request. Open listing management and show where a landlord can add or edit a
listing and upload room photos; do not publish a misleading listing or upload a
stock image as though it were an actual property photo.

Open Earnings and explain that the view uses backend payment/statistics data. If
there is no transaction data, point out the honest empty state rather than
presenting sample figures.

## 3:40–4:25 — Tenant saved homes and comparison

Return to Tenant. From `/services`, save one or more homes, then open Saved homes.
If there are at least two saved listings, select them for comparison and point out
that the selected listing IDs are stored in the URL, so the comparison can be
reopened. Remove a saved home if appropriate.

Say:

> “Saved homes come from the tenant’s account on the backend. The comparison is
> shareable through URL state and is limited to three homes.”

## 4:25–5:10 — Roommate matching and profile preferences

Open Roommates and show the Suggested matches, Received requests, and Sent requests
views, including their URL state and status filter. If no matches are returned, show
the empty state and explain that results depend on the tenant profiles and backend
compatibility data. Open the Tenant profile to show the optional budget, preferred
areas, and lifestyle preferences used to calculate matches. Do not change personal
demo data unless you are comfortable restoring it after recording.

## 5:10–5:45 — Notifications and reviews

Open Notifications and show backend-provided booking/payment/account updates and the
mark-as-read controls. Then show a listing’s tenant reviews. On the Tenant dashboard,
explain that the review form only appears for a completed booking that has not
already been reviewed.

Do not claim a review was submitted unless the demo account owns a completed stay and
the API confirms success.

## 5:45–6:35 — SSLCommerz test checkout

Show Payment History and, only if a confirmed demo booking is available, use Pay rent
or Pay deposit to demonstrate payment initiation and the redirect to SSLCommerz.
Complete the transaction only with approved sandbox credentials. Show the returned
payment result and backend-confirmed history only if the sandbox actually confirms
the transaction.

Say, if you cannot complete the sandbox payment:

> “The frontend initiates the SSLCommerz checkout and handles the return routes. I
> have not completed a sandbox transaction in this walkthrough, so I am not claiming
> a successful payment.”

Never show gateway credentials or use a live card.

## 6:35–7:25 — Admin controls and responsive UI

Use the Admin demo login. Show live overview figures, user-management search/role
filters, and audit reports. If demonstrating a status change or landlord
verification, use only a disposable demo record and restore it afterwards.

Resize the browser to a mobile-width viewport. Briefly show that cards, forms,
listing filters, and dashboard navigation adapt to a narrow screen. Point out the
loading skeleton and clear empty/error states if they are naturally visible; avoid
deliberately causing a production outage.

## 7:25–7:45 — Close

Say:

> “Roomly connects role-specific dashboards, live listings, booking requests,
> saved-home comparison, roommate matching, notifications, reviews, and payment
> initiation to the backend. The frontend is live on Vercel. Illustrative listing
> photos are clearly labeled; actual property photos are uploaded by landlords.”

## Optional source note for illustrative images

The representative interior photos are downloaded from Unsplash and are not
property-specific. See the
[Unsplash license](https://unsplash.com/license).
