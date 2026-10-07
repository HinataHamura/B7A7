'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { bookingsApi, listingsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

export default function ProviderPage() {
  const queryClient = useQueryClient();
  const statsQuery = useQuery({
    queryKey: ['landlord-stats'],
    queryFn: listingsApi.getLandlordStats,
  });
  const listingsQuery = useQuery({
    queryKey: ['landlord-listings'],
    queryFn: listingsApi.getMine,
  });
  const bookingsQuery = useQuery({
    queryKey: ['landlord-bookings'],
    queryFn: bookingsApi.getLandlordBookings,
  });
  const bookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'CONFIRMED' | 'REJECTED' }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: async () => {
      toast.success('Booking request updated.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['landlord-bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['landlord-stats'] }),
      ]);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update booking.'),
  });
  const stats = statsQuery.data;
  const pendingBookings = (bookingsQuery.data ?? []).filter((booking) => booking.status === 'PENDING');

  return (
    <DashboardShell title="Landlord dashboard" role="landlord">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pill">Landlord dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Property overview</h1>
          <p className="mt-2 text-slate-600">Live listing, booking, and revenue data for your account.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/provider/listings/new" className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            Add a listing
          </Link>
          <Link href="/provider/profile" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
            Manage profile
          </Link>
        </div>
      </div>

      {(statsQuery.isError || listingsQuery.isError || bookingsQuery.isError) && (
        <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Some landlord data could not be loaded. Refresh the page or sign in again.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Published listings', stats ? String(stats.publishedListings) : '…'],
          ['Pending requests', stats ? String(stats.pendingBookings) : '…'],
          ['Paid earnings', stats ? formatCurrency(stats.totalRevenue) : '…'],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Your listings</h2>
            <div className="flex gap-3">
              <Link href="/provider/listings" className="text-sm font-semibold text-primary-700">Manage all</Link>
              <Link href="/provider/earnings" className="text-sm font-semibold text-primary-700">Earnings</Link>
            </div>
          </div>
          {listingsQuery.isLoading ? (
            <div className="m-5 h-20 animate-pulse rounded-xl bg-slate-100" />
          ) : (listingsQuery.data ?? []).length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No listings found for this landlord account.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(listingsQuery.data ?? []).slice(0, 5).map((listing) => (
                <li key={listing.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{listing.title}</p>
                    <p className="text-sm text-slate-500">{listing.area}, {listing.city}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{listing.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Pending booking requests</h2>
          </div>
          {bookingsQuery.isLoading ? (
            <div className="m-5 h-20 animate-pulse rounded-xl bg-slate-100" />
          ) : pendingBookings.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">There are no pending requests.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingBookings.slice(0, 5).map((booking) => (
                <li key={booking.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.listing.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.tenant?.name ?? 'Tenant'} · {formatDate(booking.moveInDate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => bookingMutation.mutate({ id: booking.id, status: 'CONFIRMED' })}
                        disabled={bookingMutation.isPending}
                        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => bookingMutation.mutate({ id: booking.id, status: 'REJECTED' })}
                        disabled={bookingMutation.isPending}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
