import { DashboardShell } from '@/components/dashboard-shell';

export default function ProviderEarningsPage() {
  return (
    <DashboardShell title="Earnings" role="landlord">
      <div className="mb-8">
        <p className="pill">Revenue dashboard</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Financial summary</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Total income', '৳495k'],
          ['This month', '৳82k'],
          ['Pending payouts', '৳24k'],
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
