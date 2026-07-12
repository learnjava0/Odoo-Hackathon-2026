import { X } from "lucide-react";
import { cn } from "../../utils/classNames";

export function Modal({ open, title, children, onClose, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm dark:bg-ink-950/60">
      <div className={cn("panel max-h-[90vh] w-full max-w-3xl overflow-auto p-6 shadow-2xl shadow-slate-950/10 dark:shadow-ink-950/50", className)}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
