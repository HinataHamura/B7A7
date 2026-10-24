import Link from 'next/link';
import { Building2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Listings', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Help Center', href: '/contact' },
    { label: 'Privacy Policy', href: '/contact' },
    { label: 'Terms of Service', href: '/contact' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Tenant Dashboard', href: '/dashboard' },
    { label: 'List Your Space', href: '/register' },
  ],
};

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="container-shell py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
                <Building2 size={18} />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Roomly</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-600 dark:text-slate-400">
              Discover curated rooms, connect with compatible roommates, and enjoy secure digital bookings across Dhaka.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-white">{section}</h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-600 transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-700 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Roomly. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <span>hello@roomly.app</span>
            <span>+880 1700-000000</span>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
