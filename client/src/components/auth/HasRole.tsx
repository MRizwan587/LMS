import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../../types/auth';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

type Role = User['role'];

const allowedRoles: Role[] = ['student', 'librarian', 'author'];

export interface HasRoleProps {
  roles?: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function HasRole({ roles = allowedRoles, children, fallback = null }: HasRoleProps) {
  const user = getStoredUser();
  const currentRole = user?.role;
  const isAllowed =
    Array.isArray(roles) && roles.length > 0 && currentRole && roles.includes(currentRole);

  if (!isAllowed) return <>{fallback}</>;
  return <>{children}</>;
}

export interface HasRoleRouteProps {
  roles?: Role[];
  children: ReactNode;
  redirectTo?: string;
}

export function HasRoleRoute({
  roles = allowedRoles,
  children,
  redirectTo = '/dashboard',
}: HasRoleRouteProps) {
  const user = getStoredUser();
  const currentRole = user?.role;
  const isAllowed =
    Array.isArray(roles) && roles.length > 0 && currentRole && roles.includes(currentRole);

  if (!isAllowed) {
    const to = user ? redirectTo : '/login';
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
}

export interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const user = getStoredUser();
  if (!user) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}