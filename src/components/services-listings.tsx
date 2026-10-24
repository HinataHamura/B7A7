'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SlidersHorizontal, X } from 'lucide-react';
import { AISearchSuggestions } from '@/components/ai-search-suggestions';
import { listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { ListingPhoto } from '@/components/listing-photo';
import { ListingSaveButton } from '@/components/listing-save-button';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';

function CardSkeleton() {
  return (
    <div className="glass-panel flex flex-col overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-700" />
      <div className="flex flex-col p-5 gap-3">
        <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-9 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

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
      sort: searchParams.get('sort') ?? 'newest',
      page: Math.max(1, Number(searchParams.get('page') ?? '1') || 1),
    }),
    [searchParams],
  );
  const [draft, setDraft] = useState(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      sort: filters.sort,
      page: filters.page,
      limit: 8,
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

  const activeFilterCount = [
    draft.search, draft.city, draft.minRent, draft.maxRent, draft.type, draft.bedrooms,
  ].filter(Boolean).length;

  const clearFilters = () => setDraft({ search: '', city: '', minRent: '', maxRent: '', type: '', bedrooms: '', sort: 'newest', page: 1 });

  return (
    <>
      <SiteNavbar />
      <main className="container-shell py-10">
        <div className="mb-8">
          <span className="pill">Available homes</span>
          <h1 className="mt-4 text-4xl font-black text-slate-900 dark:text-white">Find your next room.</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Search Roomly's live published listings by location, rent, and room type.</p>
        </div>

        {/* Search + Sort bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <AISearchSuggestions
            value={draft.search}
            onChange={(v) => updateDraft('search', v)}
            onSelect={(v) => updateDraft('search', v)}
          />
          <div className="flex gap-2">
            <select
              aria-label="Sort listings"
              value={draft.sort}
              onChange={(e) => updateDraft('sort', e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <section
            aria-label="Advanced filters"
            className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-5"
          >
            <input
              aria-label="City"
              value={draft.city}
              onChange={(e) => updateDraft('city', e.target.value)}
              placeholder="Any city"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <input
              aria-label="Minimum rent"
              type="number"
              min="0"
              value={draft.minRent}
              onChange={(e) => updateDraft('minRent', e.target.value)}
              placeholder="Min rent (৳)"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <input
              aria-label="Maximum rent"
              type="number"
              min="0"
              value={draft.maxRent}
              onChange={(e) => updateDraft('maxRent', e.target.value)}
              placeholder="Max rent (৳)"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <select
              aria-label="Listing type"
              value={draft.type}
              onChange={(e) => updateDraft('type', e.target.value)}
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">All room types</option>
              <option value="ENTIRE_PLACE">Entire place</option>
              <option value="PRIVATE_ROOM">Private room</option>
              <option value="SHARED_ROOM">Shared room</option>
            </select>
            <select
              aria-label="Bedrooms"
              value={draft.bedrooms}
              onChange={(e) => updateDraft('bedrooms', e.target.value)}
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Any bedrooms</option>
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>{count}+ bedroom{count > 1 ? 's' : ''}</option>
              ))}
            </select>
          </section>
        )}

        {/* Results count */}
        {!isLoading && data?.meta && (
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Showing {listings.length} of {data.meta.total} listings
          </p>
        )}

        {isError ? (
          <div role="alert" className="glass-panel p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Listings could not be loaded.</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{error instanceof Error ? error.message : 'Please try again.'}</p>
            <button type="button" onClick={() => router.refresh()} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No rooms match these filters.</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Adjust your location or rent range to see more available homes.</p>
            <button type="button" onClick={clearFilters} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {listings.map((listing) => (
              <article key={listing.id} className="glass-panel flex flex-col overflow-hidden">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-700">
                  <ListingPhoto images={listing.images} title={listing.title} type={listing.type} />
                  <div className="absolute right-3 top-3">
                    <ListingSaveButton listingId={listing.id} />
                  </div>
                  {listing.landlord?.isVerifiedHost && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                      Verified
                    </span>
                  )}
                  {listing.images && listing.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white">
                      +{listing.images.length - 1} photos
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">{listing.title}</h2>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{listing.area}, {listing.city}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {listing.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{listing.description}</p>
                  <div className="mt-auto pt-4">
                    <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(listing.rentAmount)}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{listing.bedrooms} bedroom{listing.bedrooms === 1 ? '' : 's'}</p>
                  </div>
                  <Link
                    href={`/services/${listing.id}`}
                    className="mt-4 inline-flex justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                  >
                    View listing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {data?.meta && data.meta.totalPages > 1 && (
          <nav aria-label="Listing pages" className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => setDraft((c) => ({ ...c, page: filters.page - 1 }))}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {filters.page} of {data.meta.totalPages}
            </span>
            <button
              type="button"
              disabled={filters.page >= data.meta.totalPages}
              onClick={() => setDraft((c) => ({ ...c, page: filters.page + 1 }))}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
            >
              Next
            </button>
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
