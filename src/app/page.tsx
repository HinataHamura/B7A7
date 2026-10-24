import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { ListingPhoto } from '@/components/listing-photo';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { NewsletterForm } from '@/components/newsletter-form';
import { API_BASE_URL } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface FeaturedListing {
  id: string;
  title: string;
  type?: string;
  city: string;
  area: string;
  rentAmount: number | string;
  bedrooms: number;
  images?: string[];
  landlord?: { isVerifiedHost?: boolean; name?: string };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFeaturedListing(value: unknown): value is FeaturedListing {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.city === 'string' &&
    typeof value.area === 'string' &&
    (typeof value.rentAmount === 'number' || typeof value.rentAmount === 'string') &&
    typeof value.bedrooms === 'number'
  );
}

async function getFeaturedListings() {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?limit=4`, { cache: 'no-store' });
    if (!response.ok) return { listings: [] as FeaturedListing[], total: 0, error: true };
    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      return { listings: [] as FeaturedListing[], total: 0, error: true };
    }
    const listings = payload.data.filter(isFeaturedListing);
    const total =
      isRecord(payload.meta) && typeof payload.meta.total === 'number' ? payload.meta.total : listings.length;
    return { listings, total, error: false };
  } catch {
    return { listings: [] as FeaturedListing[], total: 0, error: true };
  }
}

const features = [
  {
    icon: Building2,
    title: 'Curated listings',
    description: 'Discover premium rental rooms, shared flats, and compatible roommate matches in active Dhaka neighborhoods.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: ShieldCheck,
    title: 'Verified stays',
    description: 'Trust verified landlords, secure bookings, and transparent listing details backed by streamlined platform checks.',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    icon: Wallet,
    title: 'Secure payments',
    description: 'Handle reservations and payment flows with a protected, modern checkout experience built for reliability.',
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
  {
    icon: Users,
    title: 'Roommate matching',
    description: 'Find compatible roommates based on lifestyle preferences, budget, and preferred neighborhoods.',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    icon: Zap,
    title: 'Instant notifications',
    description: 'Real-time alerts for booking status updates, new messages, and payment confirmations.',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart analytics',
    description: 'Landlords get powerful dashboards with booking trends, earnings insights, and occupancy data.',
    color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  },
];

const stats = [
  { value: '500+', label: 'Verified Listings' },
  { value: '1,200+', label: 'Happy Tenants' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '৳2Cr+', label: 'Transactions Processed' },
];

const testimonials = [
  {
    name: 'Fatima Rahman',
    role: 'Graduate Student, BUET',
    review: 'Found my perfect room near campus within 2 days. The verified listing system gave me confidence before moving in.',
    rating: 5,
    avatar: 'F',
    color: 'bg-primary',
  },
  {
    name: 'Arif Hossain',
    role: 'Software Engineer',
    review: 'Managing three listings is effortless with Roomly. The booking management and payment tracking are incredibly smooth.',
    rating: 5,
    avatar: 'A',
    color: 'bg-emerald-500',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Marketing Executive',
    review: 'The roommate matching feature connected me with someone who has the exact same lifestyle. Life-changing platform!',
    rating: 5,
    avatar: 'N',
    color: 'bg-amber-500',
  },
];

const faqs = [
  {
    q: 'How do I book a room on Roomly?',
    a: 'Browse listings, click "Request booking," choose your move-in date, and send a message. The landlord confirms, then secure SSLCommerz checkout is unlocked.',
  },
  {
    q: 'Are all listings verified?',
    a: "Landlords go through a verification process and earn a 'Verified Host' badge. Always check for this badge when browsing listings.",
  },
  {
    q: 'How does the roommate matching work?',
    a: 'After filling out your profile (lifestyle, budget, preferred areas), our algorithm matches you with compatible tenants. You can send connection requests directly.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Roomly uses SSLCommerz, supporting mobile banking (bKash, Nagad), net banking, and cards for secure transactions.',
  },
  {
    q: 'Can I list my property as a landlord?',
    a: 'Yes! Register as a Landlord, complete your profile, and publish listings for free. The platform handles bookings and payments end-to-end.',
  },
];

const categories = [
  { label: 'Entire Place', icon: Home, count: '120+', color: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' },
  { label: 'Private Room', icon: Building2, count: '240+', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { label: 'Shared Room', icon: Users, count: '80+', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { label: 'Near University', icon: MapPin, count: '60+', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
];

const steps = [
  { step: '01', title: 'Create an account', description: 'Sign up as a tenant or landlord in under a minute.' },
  { step: '02', title: 'Browse & filter', description: 'Use smart filters to find rooms by location, rent, and type.' },
  { step: '03', title: 'Request a booking', description: 'Send a booking request with your preferred move-in date.' },
  { step: '04', title: 'Move in with confidence', description: 'Pay securely through SSLCommerz after landlord confirmation.' },
];

const neighborhoods = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohammadpur',
  'Uttara', 'Wari', 'Bashundhara', 'Rayer Bazar', 'Zigatola',
];

export default async function HomePage() {
  const { listings, total, error } = await getFeaturedListings();

  return (
    <>
      <SiteNavbar />

      <main className="min-h-screen">
        {/* ── 1. Hero ─────────────────────────────── */}
        <section className="bg-mesh-gradient">
          <div className="container-shell py-16 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="pill">Find a room that fits your life</span>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Discover rooms,{' '}
                  <span className="text-primary">roommates</span>, and secure stays.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
                  Roomly helps tenants find better homes and landlords manage trusted listings with seamless digital booking and payment flows — all in one platform.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600"
                  >
                    Explore listings <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Create account
                  </Link>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map(({ value, label }) => (
                    <div key={label} className="glass-panel p-4 text-center">
                      <div className="text-xl font-black text-slate-900 dark:text-white">{error && label === 'Verified Listings' ? '—' : value}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel overflow-hidden p-4 sm:p-5">
                {listings[0] ? (
                  <article className="overflow-hidden rounded-2xl bg-slate-900 text-white">
                    <div className="relative h-52 bg-slate-800">
                      <ListingPhoto images={listings[0].images} title={listings[0].title} type={listings[0].type} sizes="(max-width: 1024px) 100vw, 40vw" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-300">Featured live listing</p>
                          <h2 className="mt-1 text-xl font-bold">{listings[0].title}</h2>
                        </div>
                        {listings[0].landlord?.isVerifiedHost && (
                          <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">Verified host</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{listings[0].area}, {listings[0].city}</p>
                      <p className="mt-4 text-xl font-bold">{formatCurrency(listings[0].rentAmount)}<span className="text-sm font-normal text-slate-300">/mo</span></p>
                      <Link href={`/services/${listings[0].id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200">
                        View this home <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ) : (
                  <div className="flex min-h-[22rem] flex-col items-start justify-center rounded-2xl bg-slate-900 p-6 text-white">
                    <p className="text-sm font-semibold text-emerald-300">{error ? 'Live listings unavailable' : 'New homes welcome'}</p>
                    <h2 className="mt-2 text-2xl font-bold">{error ? 'Could not load homes right now.' : 'No published homes yet.'}</h2>
                    <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200">
                      Browse listings <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Stats Banner ──────────────────────── */}
        <section className="border-y border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="container-shell py-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                ['500+', 'Published Rooms'],
                ['1,200+', 'Tenants Matched'],
                ['50+', 'Verified Landlords'],
                ['৳2Cr+', 'Secure Transactions'],
              ].map(([value, label]) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-black text-primary">{value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Categories ────────────────────────── */}
        <section className="container-shell py-16">
          <div className="text-center">
            <span className="pill">Explore by type</span>
            <h2 className="section-title mt-4">Find the right kind of home.</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Browse by room category to find the perfect fit for your lifestyle and budget.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ label, icon: Icon, count, color }) => (
              <Link key={label} href={`/services?type=${label.toUpperCase().replace(' ', '_')}`} className="glass-panel flex flex-col items-center gap-3 p-8 text-center transition hover:-translate-y-1 hover:shadow-soft">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                  <Icon size={26} />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{count} listings</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. Featured Listings ─────────────────── */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="pill">Live listings</span>
                <h2 className="section-title mt-4">Explore available homes.</h2>
              </div>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                View all listings <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {error || listings.length === 0 ? (
                <div className="glass-panel col-span-full p-10 text-center">
                  <p className="text-slate-600 dark:text-slate-400">{error ? 'Listings unavailable right now. Please check back soon.' : 'No published listings yet.'}</p>
                  <Link href="/services" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Browse all</Link>
                </div>
              ) : listings.map((listing) => (
                <article key={listing.id} className="glass-panel flex flex-col overflow-hidden">
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-700">
                    <ListingPhoto images={listing.images} title={listing.title} type={listing.type} />
                    {listing.landlord?.isVerifiedHost && (
                      <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">Verified</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold text-slate-900 dark:text-white">{listing.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{listing.area}, {listing.city}</p>
                    <p className="mt-auto pt-4 text-lg font-black text-slate-900 dark:text-white">{formatCurrency(listing.rentAmount)}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                    <Link href={`/services/${listing.id}`} className="mt-3 inline-flex justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. How It Works ──────────────────────── */}
        <section className="container-shell py-16">
          <div className="text-center">
            <span className="pill">Simple process</span>
            <h2 className="section-title mt-4">From search to move-in in 4 steps.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="glass-panel p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                  {step}
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Features ──────────────────────────── */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <span className="pill">Why Roomly</span>
              <h2 className="section-title mt-4">Everything you need in one platform.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="glass-panel p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Popular Neighborhoods ─────────────── */}
        <section className="container-shell py-16">
          <div className="text-center">
            <span className="pill">Explore by area</span>
            <h2 className="section-title mt-4">Popular neighborhoods in Dhaka.</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {neighborhoods.map((area) => (
              <Link
                key={area}
                href={`/services?city=Dhaka&search=${encodeURIComponent(area)}`}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
              >
                {area}
              </Link>
            ))}
          </div>
        </section>

        {/* ── 8. Testimonials ──────────────────────── */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="text-center">
              <span className="pill">User stories</span>
              <h2 className="section-title mt-4">Trusted by tenants and landlords across Dhaka.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map(({ name, role, review, rating, avatar, color }) => (
                <div key={name} className="glass-panel p-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">"{review}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}>
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. FAQ ───────────────────────────────── */}
        <section className="container-shell py-16">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="pill">Common questions</span>
              <h2 className="section-title mt-4">Frequently asked questions.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="glass-panel p-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare size={18} className="mt-0.5 shrink-0 text-primary-500" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{q}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. For Landlords ────────────────────── */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="glass-panel overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 sm:p-12">
                  <span className="pill">For landlords</span>
                  <h2 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">List your property and reach qualified tenants.</h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                    Roomly provides a professional platform to publish listings, manage bookings, handle payments, and earn verified reviews — all in one dashboard.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {['Publish listings in minutes', 'Review and confirm bookings', 'Track earnings with live analytics', 'Get a verified host badge'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                    Start listing today <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="flex flex-col justify-center gap-4 bg-slate-900 p-8 sm:p-12">
                  {[
                    ['৳0', 'Listing fee'],
                    ['3 roles', 'Admin, Landlord, Tenant'],
                    ['SSLCommerz', 'Secure checkout'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="mt-1 text-sm text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. Newsletter ───────────────────────── */}
        <section className="container-shell py-16">
          <div className="glass-panel p-8 text-center sm:p-12">
            <Sparkles size={32} className="mx-auto text-primary-500" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Stay updated with new listings.</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Get notified when new rooms drop in your preferred neighborhoods.</p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">No spam. Unsubscribe anytime.</p>
          </div>
        </section>

        {/* ── 12. CTA ──────────────────────────────── */}
        <section className="bg-primary py-16">
          <div className="container-shell text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Ready to find your next room?</h2>
            <p className="mt-4 text-lg text-primary-100">Join thousands of tenants and landlords on Roomly today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/services" className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-primary-50">
                Browse listings
              </Link>
              <Link href="/register" className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
