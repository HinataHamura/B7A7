import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel max-w-lg p-10 text-center">
        <p className="pill">404 error</p>
        <h1 className="mt-6 text-4xl font-black text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The link you followed may be outdated or the page has moved.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
          Back to home
        </Link>
      </div>
    </main>
  );
}
