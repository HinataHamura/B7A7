export default function AdminPage() {
  return (
    <main className="container-shell py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="pill">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Platform overview</h1>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total listings', '2,480'],
          ['Active bookings', '184'],
          ['Revenue', '৳620k'],
          ['Verified users', '1,540'],
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
