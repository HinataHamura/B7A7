import { DashboardShell } from '@/components/dashboard-shell';

export default function DashboardPaymentsPage() {
  return (
    <DashboardShell title="Payments" role="tenant">
      <div className="mb-8">
        <p className="pill">Payment history</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Recent transactions</h1>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3">Bill</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Room booking advance', '12 Jan 2026', 'Paid'],
              ['Security deposit', '18 Jan 2026', 'Paid'],
            ].map(([item, date, status]) => (
              <tr key={item} className="border-t border-slate-200">
                <td className="px-5 py-4 font-medium text-slate-900">{item}</td>
                <td className="px-5 py-4">{date}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
