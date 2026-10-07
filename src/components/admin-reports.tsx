'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function AdminReports() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: () => adminApi.getAuditLogs(page, 20),
  });

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage > 1) params.set('page', String(nextPage));
    else params.delete('page');
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  return (
    <DashboardShell title="Reports" role="admin">
      <div className="mb-8">
        <p className="pill">Audit &amp; operations</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Platform audit log</h1>
        <p className="mt-2 text-slate-600">Recent actions recorded by the Roomly backend.</p>
      </div>
      {isError && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error.message}</div>}
      <div className="glass-panel overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 p-5" aria-label="Loading audit log">
            {[0, 1, 2, 3].map((row) => <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          </div>
        ) : (data?.data.length ?? 0) === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No audit events are available for this page.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Entity</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-900">{entry.action}</td>
                  <td className="px-5 py-4">{entry.entityType} · {entry.entityId}</td>
                  <td className="px-5 py-4">{entry.actor?.email ?? 'System'}{entry.actor?.role ? ` (${entry.actor.role})` : ''}</td>
                  <td className="px-5 py-4">{formatDate(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data?.meta && (
        <nav aria-label="Audit log pages" className="mt-5 flex items-center justify-center gap-4">
          <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
          <span className="text-sm text-slate-600">Page {page} of {data.meta.totalPages || 1}</span>
          <button type="button" disabled={page >= data.meta.totalPages} onClick={() => goToPage(page + 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        </nav>
      )}
    </DashboardShell>
  );
}
