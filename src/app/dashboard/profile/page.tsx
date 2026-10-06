import { DashboardShell } from '@/components/dashboard-shell';

export default function DashboardProfilePage() {
  return (
    <DashboardShell title="Profile" role="tenant">
      <div className="max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="pill">Account settings</p>
        <h1 className="mt-4 text-3xl font-black text-slate-900">Update your profile</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input defaultValue="Rafi Hasan" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
            <input defaultValue="01700000000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">Save changes</button>
        </div>
      </div>
    </DashboardShell>
  );
}
