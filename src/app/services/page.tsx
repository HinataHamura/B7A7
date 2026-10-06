"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listingsApi } from '@/lib/api';

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      searchTerm: searchParams.get('search') ?? '',
      city: searchParams.get('city') ?? 'Dhaka',
      minRent: searchParams.get('minRent') ?? '',
      maxRent: searchParams.get('maxRent') ?? '',
    }),
    [searchParams],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () =>
      listingsApi.getAll({
        searchTerm: filters.searchTerm,
        city: filters.city,
        minRent: filters.minRent,
        maxRent: filters.maxRent,
        page: '1',
        limit: '12',
      }),
  });

  const listings = Array.isArray(data) ? data : [];

  const updateFilters = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.replace(`/services?${params.toString()}`);
  };

  if (isError) {
    toast.error('Failed to load listings from the Roomly API.');
  }

  return (
    <main className="container-shell py-12">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="pill">Available homes</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900">Find your next room.</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            defaultValue={filters.searchTerm}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search by title or area"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-500"
          />
          <input
            defaultValue={filters.city}
            onChange={(e) => updateFilters({ city: e.target.value })}
            placeholder="City"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-panel h-64 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">No rooms match your current filters.</h2>
          <p className="mt-2 text-slate-600">Try a different city or widen the rent range.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="glass-panel overflow-hidden">
              <div className="h-52 bg-gradient-to-br from-primary-100 via-slate-100 to-slate-200" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{listing.title || 'Available Room'}</h2>
                    <p className="mt-1 text-sm text-slate-500">{listing.area || 'Dhaka'} • {listing.city || 'Dhaka'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {listing.status || 'PUBLISHED'}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600">{listing.description || 'Comfortable room with secure access, good neighborhood connectivity, and verified landlord support.'}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rent</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">৳{listing.rentAmount ?? 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bedrooms</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{listing.bedrooms ?? 1}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
