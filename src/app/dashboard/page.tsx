export default function DashboardPage() {
  return (
    <main className="container-shell py-10">
      <div className="mb-8">
        <p className="pill">Tenant dashboard</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">My activity</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Saved homes', '14'],
          ['Upcoming bookings', '3'],
          ['Payments made', '৳116k'],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
