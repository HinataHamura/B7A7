'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { ListingPhoto } from '@/components/listing-photo';
import { ListingSaveButton } from '@/components/listing-save-button';
import { listingsApi, type ListingItem } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const comparisonRows: Array<{ label: string; value: (listing: ListingItem) => string }> = [
  { label: 'Location', value: (listing) => `${listing.area}, ${listing.city}` },
  { label: 'Monthly rent', value: (listing) => formatCurrency(listing.rentAmount) },
  { label: 'Security deposit', value: (listing) => formatCurrency(listing.securityDeposit) },
  { label: 'Bedrooms', value: (listing) => String(listing.bedrooms) },
  { label: 'Bathrooms', value: (listing) => String(listing.bathrooms ?? 'Not listed') },
  { label: 'Room type', value: (listing) => listing.type?.replaceAll('_', ' ') ?? 'Not listed' },
];

export default function SavedHomesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const savedQuery = useQuery({
    queryKey: ['saved-listings'],
    queryFn: listingsApi.getSaved,
  });
  const listings = savedQuery.data ?? [];
  const compareIds = [...new Set((searchParams.get('compare') ?? '').split(',').filter(Boolean))]
    .filter((id) => listings.some((listing) => listing.id === id))
    .slice(0, 3);
  const compareListings = compareIds
    .map((id) => listings.find((listing) => listing.id === id))
    .filter((listing) => listing !== undefined);

  function toggleCompare(listingId: string) {
    const selected = compareIds.includes(listingId);
    if (!selected && compareIds.length >= 3) {
      toast.error('Compare up to three homes at a time.');
      return;
    }
    const nextIds = selected ? compareIds.filter((id) => id !== listingId) : [...compareIds, listingId];
    const params = new URLSearchParams(searchParams.toString());
    if (nextIds.length) params.set('compare', nextIds.join(','));
    else params.delete('compare');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

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
        <>
          <section aria-labelledby="compare-homes-title" className="glass-panel mb-6 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="compare-homes-title" className="text-lg font-bold text-slate-900">Compare saved homes</h2>
                <p className="mt-1 text-sm text-slate-500">Choose up to three homes. Your selection is saved in the page URL.</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{compareIds.length} / 3 selected</p>
            </div>
            {compareListings.length >= 2 ? (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <caption className="sr-only">Comparison of selected saved homes</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="border-b border-slate-200 px-3 py-3 text-slate-500">Home details</th>
                      {compareListings.map((listing) => <th key={listing.id} scope="col" className="border-b border-slate-200 px-3 py-3 font-semibold text-slate-900">{listing.title}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonRows.map(({ label, value }) => (
                      <tr key={label}>
                        <th scope="row" className="px-3 py-3 font-medium text-slate-600">{label}</th>
                        {compareListings.map((listing) => (
                          <td key={listing.id} className="px-3 py-3 text-slate-800">{value(listing)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="px-3 py-3 font-medium text-slate-600">Details</th>
                      {compareListings.map((listing) => (
                        <td key={listing.id} className="px-3 py-3">
                          <Link href={`/services/${listing.id}`} className="font-semibold text-primary-700 hover:underline">View home</Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">Select at least two saved homes below to compare rent, location, and room details.</p>
            )}
          </section>

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
                  <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={compareIds.includes(listing.id)}
                      disabled={!compareIds.includes(listing.id) && compareIds.length >= 3}
                      onChange={() => toggleCompare(listing.id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    Add to comparison
                  </label>
                  <Link href={`/services/${listing.id}`} className="mt-5 inline-flex justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                    View home
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
