import { Suspense } from 'react';
import PaymentResult from '@/components/payment-result';

export default function PaymentSuccessPage() {
  return <Suspense fallback={<main className="container-shell py-20"><div className="glass-panel mx-auto h-72 max-w-xl animate-pulse bg-slate-100" /></main>}>
    <PaymentResult outcome="success" />
  </Suspense>;
}
