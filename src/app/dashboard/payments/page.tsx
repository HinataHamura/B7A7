'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { paymentsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

export default function DashboardPaymentsPage() {
  const query = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => paymentsApi.getHistory().then((response) => response.data),
  });

  return (
    <DashboardShell title="Payments" role="tenant">
      <div className="mb-8">
        <p className="pill">Payment history</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Recent transactions</h1>
        <p className="mt-2 text-slate-600">Payments reported by the Roomly backend and gateway.</p>
      </div>
      {query.isError && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{query.error.message}</div>}
      <div className="glass-panel overflow-x-auto">
        {query.isLoading ? (
          <div className="space-y-3 p-5" aria-label="Loading payment history">
            {[0, 1, 2].map((row) => <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          </div>
        ) : (query.data ?? []).length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="font-bold text-slate-900">No payments found.</h2>
            <p className="mt-1 text-sm text-slate-500">Completed or pending gateway transactions will appear here.</p>
          </div>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">Listing / purpose</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{payment.booking.listing.title}</p>
                    <p className="text-xs text-slate-500">{payment.purpose.replaceAll('_', ' ')}</p>
                  </td>
                  <td className="px-5 py-4">{formatCurrency(payment.amount)}</td>
                  <td className="px-5 py-4">{formatDate(payment.paidAt ?? payment.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{payment.status}</span>
                  </td>
                  <td className="max-w-44 truncate px-5 py-4 font-mono text-xs">{payment.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
