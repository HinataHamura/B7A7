import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';

const plans = [
  {
    name: 'Starter',
    price: '৳0',
    period: 'Forever free',
    description: 'For individual renters exploring listings',
    features: [
      'Browse all listings',
      'Save favorite homes',
      'Send booking requests',
      'Roommate matching',
      'Notification inbox',
    ],
    cta: 'Get started free',
    href: '/register',
    accent: false,
  },
  {
    name: 'Growth',
    price: '৳1,499',
    period: '/ month',
    description: 'For landlords managing up to 20 listings',
    features: [
      'Everything in Starter',
      'Publish up to 20 listings',
      'Booking management',
      'SSLCommerz payments',
      'Earnings dashboard',
      'Verified host badge',
    ],
    cta: 'Start as Landlord',
    href: '/register',
    accent: true,
  },
  {
    name: 'Pro',
    price: '৳3,499',
    period: '/ month',
    description: 'For property managers and agencies',
    features: [
      'Everything in Growth',
      'Unlimited listings',
      'Advanced analytics',
      'Priority support',
      'Team access',
      'Custom integrations',
    ],
    cta: 'Contact sales',
    href: '/contact',
    accent: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteNavbar />
      <main>
        <section className="bg-mesh-gradient py-16">
          <div className="container-shell text-center">
            <span className="pill">Pricing</span>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Simple, transparent pricing.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Start for free. Upgrade when you need more power.
            </p>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map(({ name, price, period, description, features, cta, href, accent }) => (
              <div
                key={name}
                className={`glass-panel flex flex-col p-8 ${accent ? 'border-2 border-primary ring-2 ring-primary/10' : ''}`}
              >
                {accent && (
                  <span className="mb-4 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    Most popular
                  </span>
                )}
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{price}</span>
                  <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">{period}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    accent
                      ? 'bg-primary text-white hover:bg-primary-600'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-panel p-8 text-center">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">All plans include</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['Secure SSLCommerz payments', 'AI-powered search', 'Roommate matching', '24/7 platform uptime'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check size={15} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
