export function DashboardRouteLoading() {
  return (
    <main className="container-shell py-8" aria-label="Loading dashboard">
      <div className="mb-8 space-y-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => <div key={index} className="glass-panel h-28 animate-pulse bg-slate-100" />)}
      </div>
      <div className="glass-panel mt-8 h-72 animate-pulse bg-slate-100" />
    </main>
  );
}

export function ListingsRouteLoading() {
  return (
    <main className="container-shell py-12" aria-label="Loading listings">
      <div className="mb-8 space-y-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="mb-8 h-16 animate-pulse rounded-2xl bg-slate-100" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="glass-panel h-72 animate-pulse bg-slate-100" />)}
      </div>
    </main>
  );
}

export function ListingDetailRouteLoading() {
  return (
    <main className="container-shell py-12" aria-label="Loading home details">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="glass-panel h-[36rem] animate-pulse bg-slate-100" />
        <div className="glass-panel h-[32rem] animate-pulse bg-slate-100" />
      </div>
    </main>
  );
}

export function ProfileRouteLoading() {
  return (
    <main className="container-shell py-8" aria-label="Loading profile">
      <div className="glass-panel max-w-2xl space-y-5 p-6 sm:p-8">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
        {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
      </div>
    </main>
  );
}
