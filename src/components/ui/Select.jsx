export function Select({ label, error, children, helperText, ...props }) {
  return (
    <label className="block">
      {label ? <span className="label-base">{label}</span> : null}
      <select className="input-base" {...props}>
        {children}
      </select>
      {error ? <span className="mt-2 block text-sm text-red-400">{error}</span> : null}
      {!error && helperText ? <span className="mt-2 block text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
}
