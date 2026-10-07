'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Roomly route error:', error);
  }, [error]);

  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-12">
      <div role="alert" className="glass-panel max-w-lg p-8 text-center sm:p-10">
        <p className="pill">Something went wrong</p>
        <h1 className="mt-6 text-3xl font-black text-slate-900">Unable to load this page</h1>
        <p className="mt-3 text-slate-600">An unexpected error occurred while rendering this view. Please try again, or return to Roomly home.</p>
        {error.digest && <p className="mt-3 text-xs text-slate-400">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
