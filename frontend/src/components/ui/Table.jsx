import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/classNames";

export function Table({ columns, rows, sort, onSort, renderRow }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      <div className="max-h-[28rem] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-900">
            <tr className="border-b border-slate-800">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-slate-400">
                  <button
                    type="button"
                    className={cn("inline-flex items-center gap-1", column.sortable && "hover:text-slate-200")}
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
          <tbody className="divide-y divide-slate-800">{rows.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}
