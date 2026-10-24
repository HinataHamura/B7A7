import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle2, Heart, Shield, Users, Zap } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'We verify landlords and listings to ensure tenants can book with complete confidence.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'We build technology that strengthens real-world connections between neighbors.',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    icon: Zap,
    title: 'Speed & Simplicity',
    description: 'We eliminate friction at every step — from search to booking to payment.',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    icon: Users,
    title: 'Inclusive Access',
    description: 'We believe everyone deserves access to safe, affordable housing options.',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
];

const team = [
  { name: 'Rahim Chowdhury', role: 'CEO & Co-founder', avatar: 'R', color: 'bg-primary' },
  { name: 'Sumaiya Islam', role: 'CTO', avatar: 'S', color: 'bg-emerald-500' },
  { name: 'Tariq Ahmed', role: 'Head of Product', avatar: 'T', color: 'bg-amber-500' },
  { name: 'Nadia Begum', role: 'Head of Trust & Safety', avatar: 'N', color: 'bg-rose-500' },
];

const milestones = [
  { year: '2022', event: 'Roomly founded in Dhaka with a mission to simplify renting.' },
  { year: '2023', event: 'Launched SSLCommerz integration for secure tenant payments.' },
  { year: '2024', event: 'Reached 1,000+ verified listings and 5,000 active users.' },
  { year: '2025', event: 'Introduced AI-powered roommate matching and personalized recommendations.' },
];

export default function AboutPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        {/* Hero */}
        <section className="bg-mesh-gradient py-16 sm:py-24">
          <div className="container-shell">
            <div className="max-w-3xl">
              <span className="pill">About Roomly</span>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                A smarter way to find a room or manage a property.
              </h1>
              <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
                Roomly connects tenants with curated rooms and reliable landlords, while providing a platform to manage listings, bookings, payments, and verification in one place — built for modern Dhaka.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
                  Browse listings <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container-shell py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="pill">Our mission</span>
              <h2 className="section-title mt-5">Making quality housing accessible for everyone.</h2>
              <p className="mt-5 text-slate-600 dark:text-slate-400">
                Housing is one of the most fundamental human needs. Yet for millions of students, professionals, and families in Dhaka, finding safe and affordable accommodation remains a stressful, opaque process.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Roomly was built to change that. We provide a transparent, trusted marketplace where every listing is verifiable, every booking is secure, and every payment is protected.
              </p>
              <ul className="mt-6 space-y-3">
                {['Real-time listing availability', 'Verified host badges', 'Secure SSLCommerz checkout', 'AI-powered roommate matching'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                ['500+', 'Active Listings'],
                ['1,200+', 'Happy Tenants'],
                ['50+', 'Verified Landlords'],
                ['98%', 'Satisfaction Rate'],
              ].map(([value, label]) => (
                <div key={label} className="glass-panel flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-4xl font-black text-primary">{value}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="text-center">
              <span className="pill">What we believe</span>
              <h2 className="section-title mt-4">Our core values.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="glass-panel p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="container-shell py-16">
          <div className="text-center">
            <span className="pill">Our journey</span>
            <h2 className="section-title mt-4">Milestones that shaped Roomly.</h2>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-6">
            {milestones.map(({ year, event }) => (
              <div key={year} className="glass-panel flex gap-6 p-6">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                  {year}
                </div>
                <p className="text-slate-700 dark:text-slate-300">{event}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-slate-50 py-16 dark:bg-slate-800/50">
          <div className="container-shell">
            <div className="text-center">
              <span className="pill">The team</span>
              <h2 className="section-title mt-4">People behind Roomly.</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">A passionate team committed to transforming housing in Bangladesh.</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map(({ name, role, avatar, color }) => (
                <div key={name} className="glass-panel p-6 text-center">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${color} text-2xl font-black text-white`}>
                    {avatar}
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-shell py-16">
          <div className="glass-panel p-8 text-center sm:p-12">
            <Building2 size={36} className="mx-auto text-primary-500" />
            <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">Ready to experience Roomly?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Join thousands of users who trust Roomly for their housing needs.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">Get started</Link>
              <Link href="/contact" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
