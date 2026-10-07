'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { reviewsApi } from '@/lib/api';

const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Choose a rating').max(5),
  comment: z.string().max(1000, 'Review must be 1000 characters or fewer'),
});

type ReviewValues = z.infer<typeof reviewSchema>;

export function BookingReviewForm({ bookingId }: { bookingId: string }) {
  const queryClient = useQueryClient();
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  });
  const mutation = useMutation({
    mutationFn: (values: ReviewValues) =>
      reviewsApi.create({
        bookingId,
        rating: values.rating,
        comment: values.comment.trim() || undefined,
      }),
    onSuccess: async () => {
      toast.success('Thanks for sharing your review.');
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ['tenant-bookings'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not submit your review.'),
  });

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="mt-3 w-full rounded-xl bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">Review your completed stay</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-[9rem_1fr_auto] sm:items-end">
        <div>
          <label htmlFor={`review-rating-${bookingId}`} className="mb-1.5 block text-xs font-medium text-slate-600">Rating</label>
          <select
            id={`review-rating-${bookingId}`}
            {...form.register('rating', { setValueAs: (value) => Number(value) })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value={5}>5 — Excellent</option>
            <option value={4}>4 — Very good</option>
            <option value={3}>3 — Good</option>
            <option value={2}>2 — Fair</option>
            <option value={1}>1 — Poor</option>
          </select>
        </div>
        <div>
          <label htmlFor={`review-comment-${bookingId}`} className="mb-1.5 block text-xs font-medium text-slate-600">Your review (optional)</label>
          <textarea
            id={`review-comment-${bookingId}`}
            rows={2}
            maxLength={1000}
            placeholder="Share what future tenants should know."
            {...form.register('comment')}
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          {form.formState.errors.comment && <p className="mt-1 text-xs text-red-600">{form.formState.errors.comment.message}</p>}
        </div>
        <button type="submit" disabled={mutation.isPending} className="rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60">
          {mutation.isPending ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  );
}
