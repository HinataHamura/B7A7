import { Suspense } from 'react';
import ProviderListings from '@/components/provider-listings';

export default function ProviderListingsPage() {
  return (
    <Suspense fallback={<main className="container-shell py-10"><div className="glass-panel h-96 animate-pulse bg-slate-100" /></main>}>
      <ProviderListings />
    </Suspense>
  );
}
