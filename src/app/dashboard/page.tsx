'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { bookingsApi, paymentsApi, type Payment } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { BookingReviewForm } from '@/components/booking-review-form';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const bookingsQuery = useQuery({
    queryKey: ['tenant-bookings'],
    queryFn: bookingsApi.getMine,
  });
  const paymentsQuery = useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => paymentsApi.getHistory().then((response) => response.data),
  });
  const paymentMutation = useMutation({
    mutationFn: paymentsApi.initiate,
    onSuccess: ({ paymentUrl }) => {
      window.location.assign(paymentUrl);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not start checkout.'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tenant-payments'] }),
  });

  const bookings = bookingsQuery.data ?? [];
  const payments = paymentsQuery.data ?? [];
  const paidTotal = payments
    .filter((payment) => payment.status === 'PAID')
    .reduce((total, payment) => total + Number(payment.amount), 0);
  const hasError = bookingsQuery.isError || paymentsQuery.isError;

  return (
    <DashboardShell title="Tenant dashboard" role="tenant">
      <div className="mb-8">
        <p className="pill">Tenant dashboard</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">My activity</h1>
        <p className="mt-2 text-slate-600">Bookings and payment totals from your Roomly account.</p>
      </div>

      {hasError && (
        <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load your activity from Roomly. Check your connection and refresh the page.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Total booking requests', bookingsQuery.isLoading ? '…' : String(bookings.length)],
          [
            'Upcoming / active',
            bookingsQuery.isLoading
              ? '…'
              : String(bookings.filter((booking) => ['PENDING', 'CONFIRMED'].includes(booking.status)).length),
          ],
          ['Payments completed', paymentsQuery.isLoading ? '…' : formatCurrency(paidTotal)],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 glass-panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent bookings</h2>
            <p className="text-sm text-slate-500">Current booking status and move-in dates.</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-primary-700">Explore homes</Link>
        </div>
        {bookingsQuery.isLoading ? (
          <div className="space-y-3 p-5" aria-label="Loading bookings">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-slate-800">No booking requests yet.</p>
            <p className="mt-1 text-sm text-slate-500">Browse available listings to request a stay.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 6).map((booking) => (
              <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{booking.listing.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Move-in {formatDate(booking.moveInDate)} · {booking.listing.city}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {booking.status}
                </span>
                {booking.status === 'CONFIRMED' && (
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['BOOKING_ADVANCE', 'Pay rent'],
                        ['SECURITY_DEPOSIT', 'Pay deposit'],
                      ] as const
                    ).filter(([purpose]) =>
                      !booking.payments?.some(
                        (payment: Payment) => payment.purpose === purpose && payment.status === 'PAID',
                      ),
                    ).map(([purpose, label]) => (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => paymentMutation.mutate({ bookingId: booking.id, purpose })}
                        disabled={paymentMutation.isPending}
                        className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {paymentMutation.isPending ? 'Opening…' : label}
                      </button>
                    ))}
                  </div>
                )}
                {booking.status === 'COMPLETED' && (
                  <div className="basis-full">
                    {booking.review ? (
                      <p className="mt-2 text-sm font-semibold text-emerald-700">Your review: {booking.review.rating}/5 · Verified stay</p>
                    ) : (
                      <BookingReviewForm bookingId={booking.id} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
