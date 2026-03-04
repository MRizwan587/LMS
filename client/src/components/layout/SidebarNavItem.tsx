import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SidebarNavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export function SidebarNavItem({ to, icon, label }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        }`
      }
    >
      <span className="flex shrink-0 text-slate-500 dark:text-slate-400" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}
