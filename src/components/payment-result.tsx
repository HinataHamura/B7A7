'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api';

export default function PaymentResult({ outcome }: { outcome: 'success' | 'cancel' }) {
  const params = useSearchParams();
  const transactionId = params.get('transactionId');
  const requestedOutcome = params.get('outcome');
  const historyQuery = useQuery({
    queryKey: ['payment-result', transactionId],
    queryFn: () => paymentsApi.getHistory(1, 100).then((result) => result.data),
    enabled: Boolean(transactionId),
    retry: false,
  });
  const payment = historyQuery.data?.find((item) => item.transactionId === transactionId);
  const succeeded = outcome === 'success' && payment?.status === 'PAID';
  const heading = succeeded
    ? 'Payment verified'
    : outcome === 'cancel' && requestedOutcome === 'cancel'
      ? 'Payment cancelled'
      : outcome === 'cancel'
        ? 'Payment was not completed'
        : 'Checking payment status';

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-20">
      <div className="glass-panel w-full max-w-xl p-7 text-center sm:p-10">
        <p className="pill">{succeeded ? 'SSLCommerz transaction' : 'Payment status'}</p>
        <h1 className="mt-6 text-3xl font-black text-slate-900">{heading}</h1>
        <p className="mt-3 text-slate-600">
          {historyQuery.isLoading
            ? 'Checking the payment record saved by the Roomly backend…'
            : succeeded
              ? `The Roomly API confirms this transaction is paid${payment ? ` (${payment.status})` : ''}.`
              : outcome === 'cancel'
                ? 'The gateway returned without completing this payment. You can retry from your confirmed booking.'
                : historyQuery.isError
                  ? 'We could not verify the transaction from this session. Sign in and check payment history before retrying.'
                  : 'The gateway returned, but the Roomly payment record is not marked paid yet. Check again in a moment.'}
        </p>
        {transactionId && (
          <p className="mt-5 break-all rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-600">
            Transaction: {transactionId}
          </p>
        )}
        {payment && <p className="mt-3 text-sm font-semibold text-slate-700">Current API status: {payment.status}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
            Go to dashboard
          </Link>
          <Link href="/dashboard/payments" className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
            Payment history
          </Link>
        </div>
      </div>
    </main>
  );
}
