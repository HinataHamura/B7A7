'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewsApi } from '@/lib/api';

export function ListingReviews({ listingId }: { listingId: string }) {
  const reviewsQuery = useQuery({
    queryKey: ['listing-reviews', listingId],
    queryFn: () => reviewsApi.getForListing(listingId),
  });

  useEffect(() => {
    if (reviewsQuery.isError) {
      toast.error(reviewsQuery.error instanceof Error ? reviewsQuery.error.message : 'Reviews could not be loaded.');
    }
  }, [reviewsQuery.error, reviewsQuery.isError]);

  return (
    <section className="mt-8 border-t border-slate-100 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tenant reviews</h2>
          <p className="mt-1 text-sm text-slate-500">Feedback from completed, verified stays.</p>
        </div>
        {reviewsQuery.data && reviewsQuery.data.totalReviews > 0 && (
          <p className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800">
            {reviewsQuery.data.averageRating.toFixed(1)} / 5 · {reviewsQuery.data.totalReviews} review{reviewsQuery.data.totalReviews === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {reviewsQuery.isLoading ? (
        <div className="mt-4 space-y-3" aria-label="Loading reviews">
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : reviewsQuery.isError ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Reviews are temporarily unavailable.
          <button type="button" onClick={() => void reviewsQuery.refetch()} className="ml-2 font-semibold underline">Try again</button>
        </div>
      ) : reviewsQuery.data?.reviews.length ? (
        <ul className="mt-4 space-y-3">
          {reviewsQuery.data.reviews.map((review) => (
            <li key={review.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{review.tenant?.name ?? 'Roomly tenant'}</p>
                <p aria-label={`${review.rating} out of 5 stars`} className="text-sm font-semibold text-amber-700">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} <span className="text-slate-600">{review.rating}/5</span></p>
              </div>
              {review.comment && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{review.comment}</p>}
              <time dateTime={review.createdAt} className="mt-2 block text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
                {review.isVerifiedStay ? ' · Verified stay' : ''}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No reviews have been submitted for this home yet.</p>
      )}
    </section>
  );
}
