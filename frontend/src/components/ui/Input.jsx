import React from "react";

export const Input = React.forwardRef(({ label, error, helperText, ...props }, ref) => {
  return (
    <label className="block">
      {label ? <span className="label-base">{label}</span> : null}
      <input className="input-base" ref={ref} {...props} />
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
      {!error && helperText ? <span className="mt-2 block text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
});

Input.displayName = "Input";
