import React from "react";

export const Select = React.forwardRef(({ label, error, children, helperText, ...props }, ref) => {
  return (
    <label className="block">
      {label ? <span className="label-base">{label}</span> : null}
      <select className="input-base" ref={ref} {...props}>
        {children}
      </select>
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
      {!error && helperText ? <span className="mt-2 block text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
});

Select.displayName = "Select";
