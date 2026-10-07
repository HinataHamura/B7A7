export default function SavedHomesLoading() {
  return (
    <main className="container-shell py-8">
      <div className="mb-8">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading saved homes">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass-panel h-72 animate-pulse bg-slate-100" />
        ))}
      </div>
    </main>
  );
}
