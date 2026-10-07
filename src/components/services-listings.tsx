'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { ListingPhoto } from '@/components/listing-photo';
import { ListingSaveButton } from '@/components/listing-save-button';

export default function ServicesListings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      city: searchParams.get('city') ?? '',
      minRent: searchParams.get('minRent') ?? '',
      maxRent: searchParams.get('maxRent') ?? '',
      type: searchParams.get('type') ?? '',
      bedrooms: searchParams.get('bedrooms') ?? '',
      page: Math.max(1, Number(searchParams.get('page') ?? '1') || 1),
    }),
    [searchParams],
  );
  const [draft, setDraft] = useState(filters);

  useEffect(() => setDraft(filters), [filters]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const nextValues = { ...draft, page: draft.page === filters.page ? 1 : draft.page };
      (Object.entries(nextValues) as [string, string | number][]).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
        else params.delete(key);
      });
      const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;
      const currentUrl = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
      if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draft, filters.page, pathname, router, searchParams]);

  const requestFilters = useMemo(
    () => ({
      searchTerm: filters.search,
      city: filters.city,
      minRent: filters.minRent,
      maxRent: filters.maxRent,
      type: filters.type,
      bedrooms: filters.bedrooms,
      page: filters.page,
      limit: 9,
    }),
    [filters],
  );
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['listings', requestFilters],
    queryFn: () => listingsApi.getAll(requestFilters),
  });
  const listings = data?.data ?? [];

  useEffect(() => {
    if (isError) toast.error(error instanceof Error ? error.message : 'Failed to load listings.');
  }, [error, isError]);

  const updateDraft = (field: keyof typeof draft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value, page: 1 }));

  return (
    <main className="container-shell py-12">
      <div className="mb-8">
        <p className="pill">Available homes</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Find your next room.</h1>
        <p className="mt-2 text-slate-600">Search Roomly’s live published listings by location, rent, and room type.</p>
      </div>

      <section aria-label="Filter listings" className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <input
          aria-label="Search listings"
          value={draft.search}
          onChange={(event) => updateDraft('search', event.target.value)}
          placeholder="Search title or area"
          className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
        <input
          aria-label="City"
          value={draft.city}
          onChange={(event) => updateDraft('city', event.target.value)}
          placeholder="Any city"
          className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
        <input
          aria-label="Minimum rent"
          type="number"
          min="0"
          value={draft.minRent}
          onChange={(event) => updateDraft('minRent', event.target.value)}
          placeholder="Min rent (৳)"
          className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
        <input
          aria-label="Maximum rent"
          type="number"
          min="0"
          value={draft.maxRent}
          onChange={(event) => updateDraft('maxRent', event.target.value)}
          placeholder="Max rent (৳)"
          className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        />
        <select
          aria-label="Listing type"
          value={draft.type}
          onChange={(event) => updateDraft('type', event.target.value)}
          className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        >
          <option value="">All room types</option>
          <option value="ENTIRE_PLACE">Entire place</option>
          <option value="PRIVATE_ROOM">Private room</option>
          <option value="SHARED_ROOM">Shared room</option>
        </select>
        <select
          aria-label="Bedrooms"
          value={draft.bedrooms}
          onChange={(event) => updateDraft('bedrooms', event.target.value)}
          className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500"
        >
          <option value="">Any bedrooms</option>
          {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}+ bedroom{count > 1 ? 's' : ''}</option>)}
        </select>
      </section>

      {isError ? (
        <div role="alert" className="glass-panel p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">Listings could not be loaded.</h2>
          <p className="mt-2 text-slate-600">{error instanceof Error ? error.message : 'Please try again.'}</p>
          <button type="button" onClick={() => router.refresh()} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="glass-panel h-64 animate-pulse bg-slate-100" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No rooms match these filters.</h2>
          <p className="mt-2 text-slate-600">Adjust your location or rent range to see more available homes.</p>
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
                {listing.images && listing.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white">
                    +{listing.images.length - 1} photos
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{listing.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{listing.area}, {listing.city}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {listing.status}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600">{listing.description}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Monthly rent</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{formatCurrency(listing.rentAmount)}</p>
                </div>
                <p className="text-sm text-slate-600">{listing.bedrooms} bedroom{listing.bedrooms === 1 ? '' : 's'}</p>
              </div>
              <Link href={`/services/${listing.id}`} className="mt-5 inline-flex justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                View listing &amp; request booking
              </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <nav aria-label="Listing pages" className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() => setDraft((current) => ({ ...current, page: filters.page - 1 }))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">Page {filters.page} of {data.meta.totalPages}</span>
          <button
            type="button"
            disabled={filters.page >= data.meta.totalPages}
            onClick={() => setDraft((current) => ({ ...current, page: filters.page + 1 }))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
