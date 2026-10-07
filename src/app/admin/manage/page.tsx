import { Suspense } from 'react';
import AdminUsers from '@/components/admin-users';

export default function AdminManagePage() {
  return (
    <Suspense fallback={<main className="container-shell py-10"><div className="glass-panel h-80 animate-pulse bg-slate-100" /></main>}>
      <AdminUsers />
    </Suspense>
  );
}
