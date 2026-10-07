export function NotificationsLoading() {
  return (
    <main className="container-shell py-8">
      <div className="mb-8">
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="glass-panel space-y-3 p-5" aria-label="Loading notifications">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </main>
  );
}
