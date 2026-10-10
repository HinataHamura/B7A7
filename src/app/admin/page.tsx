'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardShell } from '@/components/dashboard-shell';
import { adminApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const USER_COLORS = ['#4f46e5', '#14b8a6', '#f59e0b'];

export default function AdminPage() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });
  const userDistribution = stats
    ? [
        { name: 'Landlords', value: stats.totalLandlords },
        { name: 'Tenants', value: stats.totalTenants },
        {
          name: 'Other accounts',
          value: Math.max(0, stats.totalUsers - stats.totalLandlords - stats.totalTenants),
        },
      ]
    : [];
  const activityData = stats
    ? [
        {
          name: 'Listings',
          active: stats.publishedListings,
          other: Math.max(0, stats.totalListings - stats.publishedListings),
        },
        {
          name: 'Bookings',
          active: stats.activeBookings,
          other: Math.max(0, stats.totalBookings - stats.activeBookings),
        },
      ]
    : [];

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

      {isLoading ? (
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="glass-panel h-[22rem] animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : stats && (
        <section className="mt-8 grid gap-5 xl:grid-cols-2" aria-label="Platform analytics">
          <article className="glass-panel p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">User distribution</h2>
            <p className="mt-1 text-sm text-slate-500">Accounts by role, based on live platform totals.</p>
            {stats.totalUsers > 0 ? (
              <div className="mt-4 h-72" role="img" aria-label="Pie chart showing users by role">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={94}
                      paddingAngle={3}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={entry.name} fill={USER_COLORS[index % USER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Accounts']} />
                    <Legend verticalAlign="bottom" height={32} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                No user data is available to chart yet.
              </p>
            )}
          </article>

          <article className="glass-panel p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Listings &amp; bookings</h2>
            <p className="mt-1 text-sm text-slate-500">Published listings and active bookings versus remaining records.</p>
            {stats.totalListings + stats.totalBookings > 0 ? (
              <div className="mt-4 h-72" role="img" aria-label="Stacked bar chart comparing active and remaining listings and bookings">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                    <Legend verticalAlign="bottom" height={32} />
                    <Bar dataKey="active" name="Published / active" stackId="records" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="other" name="Other status" stackId="records" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                No listing or booking data is available to chart yet.
              </p>
            )}
          </article>
        </section>
      )}

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
