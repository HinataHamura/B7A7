'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { bookingsApi, listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { ListingGallery } from '@/components/listing-gallery';
import { ListingSaveButton } from '@/components/listing-save-button';
import { ListingReviews } from '@/components/listing-reviews';

const bookingSchema = z.object({
  moveInDate: z.string().min(1, 'Choose a move-in date').refine(
    (value) => new Date(`${value}T00:00:00`).getTime() > Date.now(),
    'Move-in date must be in the future',
  ),
  message: z.string().max(1000, 'Message must be 1000 characters or fewer'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function ListingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const listingQuery = useQuery({
    queryKey: ['listing', params.id],
    queryFn: () => listingsApi.getById(params.id),
    enabled: Boolean(params.id),
  });
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { moveInDate: '', message: '' },
  });
  const bookingMutation = useMutation({
    mutationFn: (values: BookingFormValues) =>
      bookingsApi.create({
        listingId: params.id,
        moveInDate: new Date(`${values.moveInDate}T00:00:00`).toISOString(),
        message: values.message || undefined,
      }),
    onSuccess: (booking) => {
      toast.success('Booking request sent. Payment becomes available after landlord confirmation.');
      router.push(`/dashboard?booking=${encodeURIComponent(booking.id)}`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not submit your booking request.'),
  });
  const listing = listingQuery.data;

  if (listingQuery.isLoading) {
    return <main className="container-shell py-12"><div className="glass-panel h-96 animate-pulse bg-slate-100" /></main>;
  }

  if (listingQuery.isError || !listing) {
    return (
      <main className="container-shell py-12">
        <div role="alert" className="glass-panel p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">This listing is unavailable.</h1>
          <p className="mt-2 text-slate-600">{listingQuery.error instanceof Error ? listingQuery.error.message : 'Try another home.'}</p>
          <Link href="/services" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Browse listings</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell py-12">
      <Link href="/services" className="text-sm font-semibold text-primary-700">← All listings</Link>
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="glass-panel p-6 sm:p-8">
          <div className="relative mb-6 h-72 overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
            <ListingGallery images={listing.images} title={listing.title} type={listing.type} />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="pill">{listing.type?.replaceAll('_', ' ') ?? 'Room listing'}</p>
              <h1 className="mt-4 text-3xl font-black text-slate-900">{listing.title}</h1>
              <p className="mt-2 text-slate-600">{listing.addressLine}, {listing.area}, {listing.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <ListingSaveButton listingId={listing.id} />
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">{listing.status}</span>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Bedrooms', listing.bedrooms],
              ['Bathrooms', listing.bathrooms ?? '—'],
              ['Max occupants', listing.maxOccupants ?? '—'],
              ['Gender preference', listing.genderPreference ?? 'Any'],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-bold text-slate-900">About this home</h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{listing.description}</p>
          {listing.amenities && listing.amenities.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-slate-900">Amenities</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => <li key={amenity} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{amenity}</li>)}
              </ul>
            </>
          )}
          <p className="mt-8 border-t border-slate-100 pt-5 text-sm text-slate-600">
            Hosted by <span className="font-semibold text-slate-900">{listing.landlord?.name ?? 'Roomly landlord'}</span>
            {listing.landlord?.isVerifiedHost ? ' · Verified host' : ''}
          </p>
          <ListingReviews listingId={listing.id} />
        </article>

        <aside className="glass-panel h-fit p-6">
          <p className="text-sm text-slate-500">Monthly rent</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{formatCurrency(listing.rentAmount)}</p>
          <p className="mt-2 text-sm text-slate-600">Security deposit: {formatCurrency(listing.securityDeposit)}</p>
          <div className="my-6 border-t border-slate-100" />
          <h2 className="text-xl font-bold text-slate-900">Request a booking</h2>
          <p className="mt-2 text-sm text-slate-600">The landlord must confirm your request before SSLCommerz checkout is enabled.</p>
          <form onSubmit={form.handleSubmit((values) => bookingMutation.mutate(values))} className="mt-5 space-y-4">
            <div>
              <label htmlFor="moveInDate" className="mb-1.5 block text-sm font-medium text-slate-700">Preferred move-in date</label>
              <input id="moveInDate" type="date" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} {...form.register('moveInDate')} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
              {form.formState.errors.moveInDate && <p className="mt-1 text-xs text-red-600">{form.formState.errors.moveInDate.message}</p>}
            </div>
            <div>
              <label htmlFor="bookingMessage" className="mb-1.5 block text-sm font-medium text-slate-700">Message (optional)</label>
              <textarea id="bookingMessage" rows={4} maxLength={1000} {...form.register('message')} placeholder="Introduce yourself and share any questions." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
              {form.formState.errors.message && <p className="mt-1 text-xs text-red-600">{form.formState.errors.message.message}</p>}
            </div>
            <button type="submit" disabled={bookingMutation.isPending} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {bookingMutation.isPending ? 'Sending request…' : 'Request booking'}
            </button>
            <p className="text-center text-xs text-slate-500">Sign in as a tenant to submit a request.</p>
          </form>
        </aside>
      </div>
    </main>
  );
}
