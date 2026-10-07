import { Suspense } from 'react';
import AdminReports from '@/components/admin-reports';

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<main className="container-shell py-10"><div className="glass-panel h-80 animate-pulse bg-slate-100" /></main>}>
      <AdminReports />
    </Suspense>
  );
}
