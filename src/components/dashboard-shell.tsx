'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutButton } from '@/components/logout-button';

const navItems = {
  admin: [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/manage', label: 'Manage users' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/listings', label: 'All listings' },
    { href: '/admin/audit', label: 'Audit log' },
  ],
  tenant: [
    { href: '/dashboard', label: 'Activity' },
    { href: '/dashboard/saved', label: 'Saved homes' },
    { href: '/dashboard/roommates', label: 'Roommates' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/payments', label: 'Payments' },
    { href: '/dashboard/notifications', label: 'Notifications' },
  ],
  landlord: [
    { href: '/provider', label: 'Overview' },
    { href: '/provider/listings', label: 'Listings' },
    { href: '/provider/earnings', label: 'Earnings' },
    { href: '/provider/profile', label: 'Profile' },
    { href: '/provider/notifications', label: 'Notifications' },
  ],
};

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('roomly_user');
      if (raw) setUser(JSON.parse(raw) as { email: string; role: string });
    } catch { /* empty */ }

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return <LogoutButton />;

  const profileHref = user.role === 'ADMIN' ? '/admin' : user.role === 'LANDLORD' ? '/provider/profile' : '/dashboard/profile';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {user.email[0].toUpperCase()}
        </div>
        <span className="hidden max-w-[120px] truncate sm:block">{user.email.split('@')[0]}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
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
              href={profileHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <User size={15} /> Profile
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <LayoutDashboard size={15} /> Back to site
            </Link>
          </div>
          <div className="border-t border-slate-100 py-1 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('roomly_user');
                localStorage.removeItem('roomly_access_token');
                document.cookie = 'roomly_role=; path=/; max-age=0';
                document.cookie = 'roomly_access_token=; path=/; max-age=0';
                window.location.href = '/';
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({
  title,
  role,
  children,
}: {
  title: string;
  role: 'admin' | 'tenant' | 'landlord';
  children: React.ReactNode;
}) {
  const items = navItems[role];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <aside className="border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
        <div className="container-shell flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
              R
            </Link>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Roomly</p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DashboardNav items={items} />
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </aside>

      <main className="container-shell py-8">{children}</main>
    </div>
  );
}
