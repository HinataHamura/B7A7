import { DashboardShell } from '@/components/dashboard-shell';
import { NotificationInbox } from '@/components/notification-inbox';

type DashboardRole = 'admin' | 'tenant' | 'landlord';

const roleTitles: Record<DashboardRole, string> = {
  admin: 'Admin notifications',
  tenant: 'Your notifications',
  landlord: 'Landlord notifications',
};

export function DashboardNotificationsPage({ role }: { role: DashboardRole }) {
  return (
    <DashboardShell title={roleTitles[role]} role={role}>
      <div className="mb-8">
        <p className="pill">Roomly updates</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">{roleTitles[role]}</h1>
        <p className="mt-2 text-slate-600">Booking, listing, payment, and account updates from your Roomly activity.</p>
      </div>
      <NotificationInbox />
    </DashboardShell>
  );
}
