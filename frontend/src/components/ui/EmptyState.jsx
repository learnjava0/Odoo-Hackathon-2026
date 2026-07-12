export function EmptyState({ title, description }) {
  return (
    <div className="panel-muted flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>
    </div>
  );
}
