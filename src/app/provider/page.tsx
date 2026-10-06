export default function ProviderPage() {
  return (
    <main className="container-shell py-10">
      <div className="mb-8">
        <p className="pill">Landlord dashboard</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Property overview</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Listings live', '12'],
          ['Pending requests', '5'],
          ['Total earnings', '৳765k'],
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
