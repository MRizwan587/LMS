import { navItems } from './navConfig';
import { SidebarNavItem } from './SidebarNavItem';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function Sidebar() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const currentRole = user?.role;
  const visibleItems = navItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
        <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Library
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {user?.name ?? 'User'}
          </p>
          <p className="text-xs capitalize">{user?.role ?? '—'}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
