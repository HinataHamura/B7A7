'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { ListingPhoto } from '@/components/listing-photo';
import { listingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const statusOptions = ['PUBLISHED', 'DRAFT', 'UNAVAILABLE', 'ARCHIVED'] as const;

export default function ProviderListings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const query = useQuery({
    queryKey: ['landlord-listings'],
    queryFn: listingsApi.getMine,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, status: nextStatus }: { id: string; status: 'PUBLISHED' | 'UNAVAILABLE' }) =>
      listingsApi.update(id, { status: nextStatus }),
    onSuccess: async () => {
      toast.success('Listing status updated.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['landlord-listings'] }),
        queryClient.invalidateQueries({ queryKey: ['listings'] }),
        queryClient.invalidateQueries({ queryKey: ['landlord-stats'] }),
      ]);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update listing.'),
  });
  const deleteMutation = useMutation({
    mutationFn: listingsApi.remove,
    onSuccess: async () => {
      toast.success('Listing archived.');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['landlord-listings'] }),
        queryClient.invalidateQueries({ queryKey: ['listings'] }),
        queryClient.invalidateQueries({ queryKey: ['landlord-stats'] }),
      ]);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not archive listing.'),
  });
  const visibleListings = useMemo(
    () =>
      (query.data ?? []).filter((listing) => {
        const matchesText = `${listing.title} ${listing.city} ${listing.area}`.toLowerCase().includes(search.toLowerCase());
        return matchesText && (!status || listing.status === status);
      }),
    [query.data, search, status],
  );

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  const archiveListing = (id: string, title: string) => {
    if (window.confirm(`Archive "${title}"? It will no longer appear in public search.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardShell title="Your listings" role="landlord">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pill">Landlord inventory</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage your properties</h1>
          <p className="mt-2 text-slate-600">Edit listing details, manage photos, and control public availability.</p>
        </div>
        <Link href="/provider/listings/new" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Create listing</Link>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          aria-label="Search your listings"
          value={search}
          onChange={(event) => updateQuery('search', event.target.value)}
          placeholder="Search title or location"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
        />
        <select
          aria-label="Filter listings by status"
          value={status}
          onChange={(event) => updateQuery('status', event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <option value="">All statuses</option>
          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      {query.isError && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{query.error.message}</div>}
      {query.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <div key={item} className="glass-panel h-56 animate-pulse bg-slate-100" />)}
        </div>
      ) : visibleListings.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">{query.data?.length ? 'No listings match your filters.' : 'You have not created any listings yet.'}</h2>
          <p className="mt-2 text-sm text-slate-600">Create a listing with clear details and real property photos to get started.</p>
          <Link href="/provider/listings/new" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">Create a listing</Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {visibleListings.map((listing) => (
            <article key={listing.id} className="glass-panel overflow-hidden sm:flex">
              <div className="relative h-48 shrink-0 bg-slate-100 sm:h-auto sm:w-52">
                <ListingPhoto images={listing.images} title={listing.title} type={listing.type} sizes="(max-width: 640px) 100vw, 208px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">{listing.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{listing.area}, {listing.city}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{listing.status}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">{formatCurrency(listing.rentAmount)} <span className="font-normal text-slate-500">/ month</span></p>
                {!listing.images?.length && <p className="mt-2 text-xs font-medium text-amber-700">Add photos to help renters evaluate this property.</p>}
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link href={`/provider/listings/${listing.id}/edit`} className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white">Edit</Link>
                  {listing.status === 'PUBLISHED' ? (
                    <button type="button" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: listing.id, status: 'UNAVAILABLE' })} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Pause listing</button>
                  ) : listing.status === 'UNAVAILABLE' || listing.status === 'DRAFT' ? (
                    <button type="button" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: listing.id, status: 'PUBLISHED' })} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">Publish</button>
                  ) : null}
                  {listing.status !== 'ARCHIVED' && (
                    <button type="button" disabled={deleteMutation.isPending} onClick={() => archiveListing(listing.id, listing.title)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">Archive</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
