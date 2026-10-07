'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { formatCurrency } from '@/lib/format';
import { roommatesApi, type RoommateRequest } from '@/lib/api';

const views = ['matches', 'received', 'sent'] as const;
type RoommateView = (typeof views)[number];
const requestStatuses = ['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED'] as const;

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function RequestCard({
  request,
  kind,
  onRespond,
  onCancel,
  isPending,
}: {
  request: RoommateRequest;
  kind: 'received' | 'sent';
  onRespond: (id: string, response: 'ACCEPTED' | 'DECLINED') => void;
  onCancel: (id: string) => void;
  isPending: boolean;
}) {
  const otherPerson = kind === 'received' ? request.sender : request.receiver;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">{otherPerson?.name ?? 'Roomly member'}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {kind === 'received' ? 'Sent you a request' : 'Request sent'} · {request.matchScore ?? 0}% match
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{statusLabel(request.status)}</span>
      </div>
      {request.message && <p className="mt-3 text-sm leading-6 text-slate-600">{request.message}</p>}
      {request.listing && <p className="mt-3 text-xs text-slate-500">For {request.listing.title} · {request.listing.city}</p>}
      <time dateTime={request.createdAt} className="mt-3 block text-xs text-slate-400">
        {new Date(request.createdAt).toLocaleDateString()}
      </time>
      {request.status === 'PENDING' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {kind === 'received' ? (
            <>
              <button type="button" onClick={() => onRespond(request.id, 'ACCEPTED')} disabled={isPending} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">Accept</button>
              <button type="button" onClick={() => onRespond(request.id, 'DECLINED')} disabled={isPending} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60">Decline</button>
            </>
          ) : (
            <button type="button" onClick={() => onCancel(request.id)} disabled={isPending} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60">Cancel request</button>
          )}
        </div>
      )}
    </article>
  );
}

export function RoommateHub() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const view = (views.includes(searchParams.get('view') as RoommateView) ? searchParams.get('view') : 'matches') as RoommateView;
  const search = searchParams.get('search') ?? '';
  const status = requestStatuses.includes(searchParams.get('status') as (typeof requestStatuses)[number])
    ? searchParams.get('status')!
    : 'ALL';
  const matchesQuery = useQuery({ queryKey: ['roommate-matches'], queryFn: roommatesApi.getMatches, enabled: view === 'matches' });
  const sentQuery = useQuery({ queryKey: ['roommate-requests', 'sent'], queryFn: roommatesApi.getSentRequests, enabled: view === 'sent' });
  const receivedQuery = useQuery({ queryKey: ['roommate-requests', 'received'], queryFn: roommatesApi.getReceivedRequests, enabled: view === 'received' });
  const sendMutation = useMutation({
    mutationFn: roommatesApi.sendRequest,
    onSuccess: () => {
      toast.success('Roommate request sent.');
      queryClient.invalidateQueries({ queryKey: ['roommate-requests', 'sent'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not send roommate request.'),
  });
  const respondMutation = useMutation({
    mutationFn: ({ id, response }: { id: string; response: 'ACCEPTED' | 'DECLINED' }) => roommatesApi.respond(id, response),
    onSuccess: () => {
      toast.success('Roommate request updated.');
      queryClient.invalidateQueries({ queryKey: ['roommate-requests'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not respond to this request.'),
  });
  const cancelMutation = useMutation({
    mutationFn: roommatesApi.cancel,
    onSuccess: () => {
      toast.success('Roommate request cancelled.');
      queryClient.invalidateQueries({ queryKey: ['roommate-requests'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not cancel this request.'),
  });

  const filteredMatches = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (matchesQuery.data ?? []).filter(({ tenant }) =>
      !normalizedSearch ||
      [tenant.name, tenant.occupation, tenant.bio, ...(tenant.preferredAreas ?? [])]
        .some((value) => value?.toLowerCase().includes(normalizedSearch)),
    );
  }, [matchesQuery.data, search]);
  const requestQuery = view === 'received' ? receivedQuery : sentQuery;
  const requests = (requestQuery.data ?? []).filter((request) => status === 'ALL' || request.status === status);
  const isMutationPending = sendMutation.isPending || respondMutation.isPending || cancelMutation.isPending;

  function updateUrl(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const activeQuery = view === 'matches' ? matchesQuery : requestQuery;

  return (
    <DashboardShell title="Roommate matching" role="tenant">
      <div className="mb-8">
        <p className="pill">Find your people</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Roommate matching</h1>
        <p className="mt-2 text-slate-600">Discover compatible tenants and manage your roommate requests.</p>
      </div>

      <nav aria-label="Roommate sections" className="mb-6 flex flex-wrap gap-2">
        {views.map((key) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('view', key);
          return (
            <Link
              key={key}
              href={`${pathname}?${params.toString()}`}
              aria-current={view === key ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${view === key ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-primary-300'}`}
            >
              {key === 'matches' ? 'Suggested matches' : key === 'received' ? 'Received requests' : 'Sent requests'}
            </Link>
          );
        })}
      </nav>

      {view === 'matches' ? (
        <div className="mb-5">
          <label htmlFor="roommate-search" className="sr-only">Search roommate matches</label>
          <input
            id="roommate-search"
            value={search}
            onChange={(event) => updateUrl({ search: event.target.value, page: '' })}
            placeholder="Search by name, occupation, or preferred area"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 sm:max-w-xl"
          />
        </div>
      ) : (
        <div className="mb-5">
          <label htmlFor="request-status" className="sr-only">Filter requests by status</label>
          <select
            id="request-status"
            value={status}
            onChange={(event) => updateUrl({ status: event.target.value === 'ALL' ? '' : event.target.value })}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
          >
            {requestStatuses.map((value) => <option key={value} value={value}>{value === 'ALL' ? 'All request statuses' : statusLabel(value)}</option>)}
          </select>
        </div>
      )}

      {activeQuery.isError ? (
        <div role="alert" className="glass-panel p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Roommate data could not be loaded.</h2>
          <p className="mt-2 text-slate-600">{activeQuery.error instanceof Error ? activeQuery.error.message : 'Please try again.'}</p>
          <button type="button" onClick={() => void activeQuery.refetch()} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      ) : activeQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading roommate information">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="glass-panel h-48 animate-pulse bg-slate-100" />)}
        </div>
      ) : view === 'matches' ? (
        filteredMatches.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">{matchesQuery.data?.length ? 'No matches found for this search.' : 'No compatible matches yet.'}</h2>
            <p className="mt-2 text-slate-600">Complete your tenant profile with your budget, preferences, and lifestyle details to improve compatibility.</p>
            <Link href="/dashboard/profile" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Update my profile</Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map(({ tenant, matchScore }) => (
              <article key={tenant.id} className="glass-panel flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{tenant.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{tenant.occupation || 'Occupation not listed'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{matchScore}% match</span>
                </div>
                {tenant.bio && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{tenant.bio}</p>}
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Budget</dt><dd className="text-right font-medium text-slate-800">{tenant.budgetMin != null && tenant.budgetMax != null ? `${formatCurrency(tenant.budgetMin)}–${formatCurrency(tenant.budgetMax)}` : 'Not listed'}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Preferred areas</dt><dd className="text-right font-medium text-slate-800">{tenant.preferredAreas?.length ? tenant.preferredAreas.join(', ') : 'Not listed'}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Lifestyle</dt><dd className="text-right font-medium text-slate-800">{[tenant.sleepSchedule, tenant.cleanliness].filter((value): value is string => Boolean(value)).map(statusLabel).join(' · ') || 'Not listed'}</dd></div>
                </dl>
                <button
                  type="button"
                  onClick={() => sendMutation.mutate({ receiverId: tenant.id })}
                  disabled={isMutationPending}
                  className="mt-5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {sendMutation.isPending ? 'Sending…' : 'Send roommate request'}
                </button>
              </article>
            ))}
          </div>
        )
      ) : requests.length === 0 ? (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">No {status === 'ALL' ? '' : `${statusLabel(status).toLowerCase()} `}{view} yet.</h2>
          <p className="mt-2 text-slate-600">{view === 'received' ? 'New roommate requests will appear here.' : 'Requests you send to compatible tenants will appear here.'}</p>
          {view === 'sent' && <Link href="/dashboard/roommates?view=matches" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Browse matches</Link>}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              kind={view}
              onRespond={(id, response) => respondMutation.mutate({ id, response })}
              onCancel={(id) => cancelMutation.mutate(id)}
              isPending={isMutationPending}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
