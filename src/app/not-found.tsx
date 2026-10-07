import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel max-w-lg p-10 text-center">
        <p className="pill">404 · Home not found</p>
        <h1 className="mt-6 text-3xl font-black text-slate-900">This page isn’t here.</h1>
        <p className="mt-3 text-slate-600">The link may be outdated, or the listing may no longer be available.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/services" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
            Browse homes
          </Link>
          <Link href="/" className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
