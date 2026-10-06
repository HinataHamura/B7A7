import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="pill">Payment successful</p>
        <h1 className="mt-6 text-4xl font-black text-slate-900">Your booking is confirmed.</h1>
        <p className="mt-3 text-slate-600">A confirmation email and receipt are being prepared for your records.</p>
        <Link href="/dashboard" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
