import { cn } from "../../utils/classNames";

export function Card({ children, className }) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}
