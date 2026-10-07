'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listingsApi } from '@/lib/api';
import { getSessionCookie } from '@/lib/auth';

export function ListingSaveButton({ listingId }: { listingId: string }) {
  const queryClient = useQueryClient();
  const [isTenant, setIsTenant] = useState(false);
  const savedQuery = useQuery({
    queryKey: ['saved-listings'],
    queryFn: listingsApi.getSaved,
    enabled: isTenant,
  });
  const toggleMutation = useMutation({
    mutationFn: () => listingsApi.toggleSaved(listingId),
    onSuccess: ({ saved }) => {
      toast.success(saved ? 'Added to your saved homes.' : 'Removed from your saved homes.');
      queryClient.invalidateQueries({ queryKey: ['saved-listings'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update saved homes.'),
  });
  const isSaved = savedQuery.data?.some((listing) => listing.id === listingId) ?? false;

  useEffect(() => {
    setIsTenant(getSessionCookie()?.role === 'TENANT');
  }, []);

  function saveListing() {
    if (!isTenant) {
      toast.error('Sign in as a tenant to save homes.');
      return;
    }
    toggleMutation.mutate();
  }

  return (
    <button
      type="button"
      onClick={saveListing}
      disabled={toggleMutation.isPending || savedQuery.isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved homes' : 'Save this home'}
      className="rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-700 disabled:opacity-60"
    >
      {toggleMutation.isPending ? 'Saving…' : isSaved ? '♥ Saved' : '♡ Save'}
    </button>
  );
}
