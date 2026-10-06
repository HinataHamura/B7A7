import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';

const stats = [
  { value: '2.4k+', label: 'Verified rooms' },
  { value: '98%', label: 'Tenant satisfaction' },
  { value: '24/7', label: 'Support coverage' },
];

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

export default function HomePage() {
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
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600">
                  Explore listings <ArrowRight size={16} />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Create account
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-panel p-4">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel overflow-hidden p-4 sm:p-5">
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Featured stay</p>
                    <h2 className="mt-2 text-2xl font-bold">Skyline Residence</h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    Verified
                  </span>
                </div>
                <div className="mt-6 grid gap-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <span>Location</span>
                    <span className="font-semibold text-white">Dhanmondi, Dhaka</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <span>Rent</span>
                    <span className="font-semibold text-white">৳18,000/mo</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <span>Room type</span>
                    <span className="font-semibold text-white">Private room</span>
                  </div>
                </div>
              </div>
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
