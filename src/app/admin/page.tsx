'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { adminApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function AdminPage() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });

  const metrics: [string, string][] = stats
    ? [
        ['Total users', String(stats.totalUsers)],
        ['Published listings', String(stats.publishedListings)],
        ['Active bookings', String(stats.activeBookings)],
        ['Verified revenue', formatCurrency(stats.totalRevenue)],
      ]
    : [];

  return (
    <DashboardShell title="Admin dashboard" role="admin">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pill">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Platform overview</h1>
          <p className="mt-2 text-slate-600">Live totals reported by the Roomly administration API.</p>
        </div>
        <Link href="/admin/manage" className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          Manage users
        </Link>
      </div>

      {isError && (
        <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Could not load platform statistics.'}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="glass-panel h-28 animate-pulse bg-slate-100" />
            ))
          : metrics.map(([label, value]) => (
              <div key={label} className="glass-panel p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
              </div>
            ))}
      </div>

      {stats && (
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ['Landlords', stats.totalLandlords],
            ['Tenants', stats.totalTenants],
            ['Reviews', stats.totalReviews],
          ].map(([label, value]) => (
            <div key={String(label)} className="glass-panel p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}
