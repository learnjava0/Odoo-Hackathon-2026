import { cn } from "../../utils/classNames";

export function Card({ children, className }) {
  return <div className={cn("panel p-5 transition duration-200 hover:shadow-md hover:shadow-slate-200/70 dark:hover:shadow-slate-900/70", className)}>{children}</div>;
}
