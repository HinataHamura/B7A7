import { DashboardShell } from '@/components/dashboard-shell';

export default function AdminManagePage() {
  return (
    <DashboardShell title="Manage listings" role="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="pill">Resource management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage app listings and users</h1>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Skyline Residence', 'Private room', 'Verified'],
              ['Green Orchid Flats', 'Shared flat', 'Pending'],
              ['City Light Studio', 'Studio', 'Verified'],
            ].map(([name, type, status]) => (
              <tr key={name} className="border-t border-slate-200">
                <td className="px-5 py-4 font-medium text-slate-900">{name}</td>
                <td className="px-5 py-4">{type}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{status}</span></td>
                <td className="px-5 py-4">
                  <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
