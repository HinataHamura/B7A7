import { DashboardShell } from '@/components/dashboard-shell';

export default function ProviderProfilePage() {
  return (
    <DashboardShell title="Profile" role="landlord">
      <div className="max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="pill">Property profile</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Update listing information</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Business name</label>
            <input defaultValue="Skyline Homes" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Contact phone</label>
            <input defaultValue="01811223344" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Save profile</button>
        </div>
      </div>
    </DashboardShell>
  );
}
