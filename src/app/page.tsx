import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { ListingPhoto } from '@/components/listing-photo';
import { API_BASE_URL } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export const dynamic = 'force-dynamic';

interface FeaturedListing {
  id: string;
  title: string;
  city: string;
  area: string;
  rentAmount: number | string;
  bedrooms: number;
  images?: string[];
  landlord?: { isVerifiedHost?: boolean };
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
    typeof value.bedrooms === 'number' &&
    (value.images === undefined || (Array.isArray(value.images) && value.images.every((image) => typeof image === 'string'))) &&
    (value.landlord === undefined || (
      isRecord(value.landlord) &&
      (value.landlord.isVerifiedHost === undefined || typeof value.landlord.isVerifiedHost === 'boolean')
    ))
  );
}

async function getFeaturedListings() {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?limit=3`, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Featured listings request failed with status ${response.status}.`);
      return { listings: [] as FeaturedListing[], total: 0, error: true };
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      console.error('Featured listings API returned an unexpected response shape.');
      return { listings: [] as FeaturedListing[], total: 0, error: true };
    }

    const listings = payload.data.filter(isFeaturedListing);
    const total = isRecord(payload.meta) && typeof payload.meta.total === 'number'
      ? payload.meta.total
      : listings.length;
    return { listings, total, error: false };
  } catch (error) {
    console.error('Featured listings could not be fetched.', error);
    return { listings: [] as FeaturedListing[], total: 0, error: true };
  }
}

const features = [
  {
    icon: Building2,
    title: 'Curated listings',
    description: 'Discover premium rental rooms, shared flats, and compatible roommate matches in active Dhaka neighborhoods.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified stays',
    description: 'Trust verified landlords, secure bookings, and transparent listing details backed by streamlined platform checks.',
  },
  {
    icon: Wallet,
    title: 'Secure payments',
    description: 'Handle reservations and payment flows with a protected, modern checkout experience built for reliability.',
  },
];

export default async function HomePage() {
  const { listings, total, error } = await getFeaturedListings();
  const featured = listings[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-mesh-gradient">
        <div className="container-shell py-14 sm:py-20">
          <nav className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-soft">
                R
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Roomly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/about" className="hidden text-sm font-medium text-slate-700 sm:inline-flex">About</Link>
              <Link href="/services" className="hidden text-sm font-medium text-slate-700 sm:inline-flex">Services</Link>
              <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Login
              </Link>
            </div>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="pill">Find a room that fits your life</span>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Discover rooms, roommates, and secure stays in one place.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                Roomly helps tenants find better homes and landlords manage trusted listings with seamless digital booking and payment flows.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600">
                  Explore listings <ArrowRight size={16} />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Create account
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="glass-panel p-4">
                  <div className="text-2xl font-bold text-slate-900">{error ? '—' : total}</div>
                  <div className="mt-1 text-sm text-slate-600">Published homes</div>
                </div>
                <div className="glass-panel p-4">
                  <div className="text-2xl font-bold text-slate-900">3</div>
                  <div className="mt-1 text-sm text-slate-600">Account roles</div>
                </div>
                <div className="glass-panel p-4">
                  <div className="text-2xl font-bold text-slate-900">SSLCommerz</div>
                  <div className="mt-1 text-sm text-slate-600">Secure checkout</div>
                </div>
              </div>
            </div>

            <div className="glass-panel overflow-hidden p-4 sm:p-5">
              {featured ? (
                <article className="overflow-hidden rounded-2xl bg-slate-900 text-white">
                  <div className="relative h-52 bg-slate-800">
                    <ListingPhoto images={featured.images} title={featured.title} sizes="(max-width: 1024px) 100vw, 40vw" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-300">Featured live listing</p>
                        <h2 className="mt-2 text-2xl font-bold">{featured.title}</h2>
                      </div>
                      {featured.landlord?.isVerifiedHost && (
                        <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">Verified host</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{featured.area}, {featured.city}</p>
                    <p className="mt-5 text-xl font-bold">{formatCurrency(featured.rentAmount)}<span className="text-sm font-medium text-slate-300"> / month</span></p>
                    <p className="mt-2 text-sm text-slate-300">{featured.bedrooms} bedroom{featured.bedrooms === 1 ? '' : 's'}</p>
                    <Link href={`/services/${featured.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200">
                      View this home <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ) : (
                <div role={error ? 'alert' : undefined} className="flex min-h-[22rem] flex-col items-start justify-center rounded-2xl bg-slate-900 p-6 text-white">
                  <p className="text-sm font-semibold text-emerald-300">{error ? 'Live listings unavailable' : 'New homes welcome'}</p>
                  <h2 className="mt-2 text-2xl font-bold">{error ? 'We could not load homes right now.' : 'No published homes just yet.'}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{error ? 'Please try browsing again in a moment.' : 'Check back soon or create an account to publish a home.'}</p>
                  <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200">
                    Browse listings <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pill">Why Roomly</p>
          <h2 className="section-title mt-5">Designed to simplify house hunting and landlord operations.</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pb-20">
        <div className="glass-panel overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="pill">A seamless workflow</p>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">From search to booking in a few steps.</h3>
            </div>
            <Sparkles className="text-primary-600" size={28} />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {['Browse listings', 'Reserve securely', 'Move in with confidence'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  0{index + 1}
                </div>
                <p className="text-base font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
