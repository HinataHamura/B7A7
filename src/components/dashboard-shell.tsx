import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';

const navItems = {
  admin: [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/manage', label: 'Manage' },
    { href: '/admin/reports', label: 'Reports' },
  ],
  tenant: [
    { href: '/dashboard', label: 'Activity' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/payments', label: 'Payments' },
  ],
  landlord: [
    { href: '/provider', label: 'Overview' },
    { href: '/provider/earnings', label: 'Earnings' },
    { href: '/provider/profile', label: 'Profile' },
  ],
};

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
    <div className="min-h-screen bg-slate-50">
      <aside className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
              R
            </Link>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Roomly</p>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </aside>

      <main className="container-shell py-8">{children}</main>
    </div>
  );
}
