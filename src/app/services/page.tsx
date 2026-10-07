import { Suspense } from 'react';
import ServicesListings from '@/components/services-listings';

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="container-shell py-12"><div className="glass-panel h-64 animate-pulse bg-slate-100" /></main>}>
      <ServicesListings />
    </Suspense>
  );
}
