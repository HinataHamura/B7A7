export default function Loading() {
  return (
    <div className="container-shell flex min-h-[50vh] items-center justify-center py-20">
      <div className="glass-panel w-full max-w-xl p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
