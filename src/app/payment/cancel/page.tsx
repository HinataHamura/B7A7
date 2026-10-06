import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="pill">Payment cancelled</p>
        <h1 className="mt-6 text-4xl font-black text-slate-900">The payment was not completed.</h1>
        <p className="mt-3 text-slate-600">You can retry the payment or explore other available rooms anytime.</p>
        <Link href="/dashboard" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
          Go back to dashboard
        </Link>
      </div>
    </main>
  );
}
