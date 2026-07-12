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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
          isActive && "bg-slate-950 text-white"
        )
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default NavItem;
