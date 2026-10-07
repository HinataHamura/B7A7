'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard-shell';
import { ListingPhoto } from '@/components/listing-photo';
import { ListingSaveButton } from '@/components/listing-save-button';
import { listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

export default function SavedHomesPage() {
  const savedQuery = useQuery({
    queryKey: ['saved-listings'],
    queryFn: listingsApi.getSaved,
  });
  const listings = savedQuery.data ?? [];

  return (
    <DashboardShell title="Saved homes" role="tenant">
      <div className="mb-8">
        <p className="pill">Your shortlist</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Saved homes</h1>
        <p className="mt-2 text-slate-600">Keep the places you like in one place while you decide where to move.</p>
      </div>

      {savedQuery.isError ? (
        <div role="alert" className="glass-panel p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Saved homes could not be loaded.</h2>
          <p className="mt-2 text-slate-600">{savedQuery.error instanceof Error ? savedQuery.error.message : 'Please try again.'}</p>
          <button type="button" onClick={() => void savedQuery.refetch()} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            Retry
          </button>
        </div>
      ) : savedQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading saved homes">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="glass-panel h-72 animate-pulse bg-slate-100" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">Your shortlist is empty.</h2>
          <p className="mt-2 text-slate-600">Save a listing to compare homes and come back to it later.</p>
          <Link href="/services" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            Explore homes
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="glass-panel flex flex-col overflow-hidden">
              <div className="relative h-56 bg-slate-100">
                <ListingPhoto images={listing.images} title={listing.title} />
                <div className="absolute right-3 top-3">
                  <ListingSaveButton listingId={listing.id} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-bold text-slate-900">{listing.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{listing.area}, {listing.city}</p>
                <p className="mt-4 text-xl font-black text-slate-900">{formatCurrency(listing.rentAmount)}<span className="text-sm font-medium text-slate-500"> / month</span></p>
                <Link href={`/services/${listing.id}`} className="mt-5 inline-flex justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                  View home
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
