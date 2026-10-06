export default function PricingPage() {
  return (
    <main className="container-shell py-16">
      <div className="mb-8 text-center">
        <p className="pill">Pricing</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Simple plans for finding and managing rooms.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['Starter', '৳0', 'For individual renters exploring listings'],
          ['Growth', '৳1,499', 'For landlords managing up to 20 listings'],
          ['Pro', '৳3,499', 'For property managers and premium team workflows'],
        ].map(([name, price, description]) => (
          <div key={name} className="glass-panel p-6">
            <h2 className="text-xl font-bold text-slate-900">{name}</h2>
            <p className="mt-4 text-3xl font-black text-slate-900">{price}<span className="text-base text-slate-500">/mo</span></p>
            <p className="mt-4 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
