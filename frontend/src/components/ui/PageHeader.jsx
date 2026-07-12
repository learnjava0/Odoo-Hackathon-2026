export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-500">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
