'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import Link from 'next/link';

export default function AdminListingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-all-listings', search, statusFilter, page],
    queryFn: () => listingsApi.getAll({ searchTerm: search, status: statusFilter || undefined, page, limit: 10 }),
  });

  const listings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <DashboardShell title="Admin dashboard" role="admin">
      <div className="mb-8">
        <span className="pill">All listings</span>
        <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Platform listings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">View and manage all listings across the platform.</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search listings…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="UNAVAILABLE">Unavailable</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="glass-panel overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />)}
          </div>
        ) : listings.length === 0 ? (
          <p className="p-8 text-center text-slate-500 dark:text-slate-400">No listings found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700">
              <tr>
                {['Title', 'Location', 'Type', 'Rent', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{l.title}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{l.area}, {l.city}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{l.type?.replace('_', ' ')}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(l.rentAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/services/${l.id}`} className="text-xs font-semibold text-primary-600 dark:text-primary-400">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-600">Previous</button>
          <span className="text-sm text-slate-600 dark:text-slate-400">Page {page} of {meta.totalPages}</span>
          <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-600">Next</button>
        </div>
      )}
    </DashboardShell>
  );
}
