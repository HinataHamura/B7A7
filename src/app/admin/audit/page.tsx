'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: () => adminApi.getAuditLogs(page, 20),
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <DashboardShell title="Admin dashboard" role="admin">
      <div className="mb-8">
        <span className="pill">Audit log</span>
        <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Platform audit log</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">All admin and system actions recorded in chronological order.</p>
      </div>

      {isError && (
        <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20">
          {error instanceof Error ? error.message : 'Could not load audit logs.'}
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />)}
          </div>
        ) : logs.length === 0 ? (
          <p className="p-8 text-center text-slate-500 dark:text-slate-400">No audit entries found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-700">
              <tr>
                {['Action', 'Entity', 'Actor', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{log.action}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{log.entityType} <span className="font-mono text-xs text-slate-400">{log.entityId.slice(0, 8)}…</span></td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{log.actor?.email ?? '—'} {log.actor?.role ? `(${log.actor.role})` : ''}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{formatDate(log.createdAt)}</td>
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
