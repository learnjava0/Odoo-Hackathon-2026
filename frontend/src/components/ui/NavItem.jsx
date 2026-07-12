import { NavLink } from "react-router-dom";
import { useAccess } from "../../hooks/useAccess";
import { cn } from "../../utils/classNames";

function NavItem({ item }) {
  const canAccess = useAccess(item.roles);

  if (!canAccess) {
    return null;
  }

  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white",
          isActive && "bg-slate-900 text-white"
        )
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default NavItem;
