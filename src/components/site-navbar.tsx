'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Building2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('roomly_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string; role?: string };
    if (parsed.email && parsed.role) return parsed;
    return null;
  } catch {
    return null;
  }
}

function getRoleDashboardPath(role: string) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'LANDLORD') return '/provider';
  return '/dashboard';
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored as { email: string; role: string });
    const onStorage = () => {
      const s = getStoredUser();
      setUser(s ? (s as { email: string; role: string }) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const loggedOutLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Listings' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const loggedInLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Listings' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const navLinks = user ? loggedInLinks : loggedOutLinks;

  const handleLogout = () => {
    localStorage.removeItem('roomly_user');
    localStorage.removeItem('roomly_access_token');
    document.cookie = 'roomly_role=; path=/; max-age=0';
    document.cookie = 'roomly_access_token=; path=/; max-age=0';
    setUser(null);
    setProfileOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
            R
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">Roomly</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.email.split('@')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-800">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {user.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      href={getRoleDashboardPath(user.role)}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      href={user.role === 'LANDLORD' ? '/provider/profile' : '/dashboard/profile'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      href="/services"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Building2 size={16} /> Browse Listings
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Get started
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 dark:border-slate-700 dark:bg-slate-900 lg:hidden">
          <nav className="mt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={getRoleDashboardPath(user.role)} onClick={() => setOpen(false)} className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white">
                  Go to Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-red-600 dark:border-slate-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
