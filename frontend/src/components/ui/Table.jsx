import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/classNames";

export function Table({ columns, rows, sort, onSort, renderRow }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-ink-900">
      <div className="max-h-[28rem] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-ink-950">
            <tr className="border-b border-slate-200 dark:border-slate-800">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                  <button
                    type="button"
                    className={cn("inline-flex items-center gap-1", column.sortable && "hover:text-slate-800 dark:hover:text-slate-100")}
                    onClick={() => column.sortable && onSort?.(column.key)}
                  >
                    {column.label}
                    {sort?.key === column.key ? (
                      sort.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">{rows.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}
