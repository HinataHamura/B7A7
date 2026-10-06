"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel max-w-lg p-10 text-center">
        <p className="pill">Something went wrong</p>
        <h1 className="mt-6 text-4xl font-black text-slate-900">Unable to load this page</h1>
        <p className="mt-3 text-slate-600">An unexpected error occurred while rendering this view. Please try again.</p>
        <button onClick={() => reset()} className="mt-8 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
          Try again
        </button>
      </div>
    </main>
  );
}
