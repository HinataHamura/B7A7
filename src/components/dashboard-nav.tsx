'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';

interface DashboardNavItem {
  href: string;
  label: string;
}

export function DashboardNav({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard sections" className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
      {items.map((item) => {
        const isRoot = ['/admin', '/dashboard', '/provider'].includes(item.href);
        const isActive = pathname === item.href || (!isRoot && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full px-3 py-2 transition ${isActive ? 'bg-primary-50 font-semibold text-primary-800' : 'hover:bg-slate-100 hover:text-slate-900'}`}
          >
            {item.label}
          </Link>
        );
      })}
      <LogoutButton />
    </nav>
  );
}
