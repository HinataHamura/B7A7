import { DashboardShell } from '@/components/dashboard-shell';

export default function AdminReportsPage() {
  return (
    <DashboardShell title="Reports" role="admin">
      <div className="mb-8">
        <p className="pill">Audit & analytics</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Performance reports</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Monthly revenue', '৳820k'],
          ['Completed bookings', '462'],
          ['Avg. rating', '4.8/5'],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
