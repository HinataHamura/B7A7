'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { listingsApi, paymentsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

export default function ProviderEarningsPage() {
  const statsQuery = useQuery({
    queryKey: ['landlord-stats'],
    queryFn: listingsApi.getLandlordStats,
  });
  const paymentsQuery = useQuery({
    queryKey: ['landlord-payments'],
    queryFn: () => paymentsApi.getHistory().then((response) => response.data),
  });
  const paidTotal = (paymentsQuery.data ?? [])
    .filter((payment) => payment.status === 'PAID')
    .reduce((total, payment) => total + Number(payment.amount), 0);

  return (
    <DashboardShell title="Earnings" role="landlord">
      <div className="mb-8">
        <p className="pill">Revenue dashboard</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Financial summary</h1>
        <p className="mt-2 text-slate-600">Confirmed values from landlord statistics and payment history.</p>
      </div>
      {(statsQuery.isError || paymentsQuery.isError) && (
        <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load complete earnings data. Refresh or sign in again.
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Lifetime paid transactions', paymentsQuery.isLoading ? '…' : formatCurrency(paidTotal)],
          ['Revenue (API total)', statsQuery.data ? formatCurrency(statsQuery.data.totalRevenue) : '…'],
          ['Completed landlord bookings', statsQuery.data ? String(statsQuery.data.activeBookings) : '…'],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 glass-panel overflow-x-auto">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">Recent transactions</h2>
        </div>
        {paymentsQuery.isLoading ? (
          <div className="m-5 h-20 animate-pulse rounded-xl bg-slate-100" />
        ) : (paymentsQuery.data ?? []).length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No transactions are linked to your listings yet.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Purpose</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentsQuery.data?.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-semibold text-slate-900">{payment.booking.listing.title}</td>
                  <td className="px-5 py-4">{payment.purpose.replaceAll('_', ' ')}</td>
                  <td className="px-5 py-4">{formatCurrency(payment.amount)}</td>
                  <td className="px-5 py-4">{formatDate(payment.paidAt ?? payment.createdAt)}</td>
                  <td className="px-5 py-4">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
