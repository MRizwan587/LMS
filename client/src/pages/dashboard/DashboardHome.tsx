import { PageContainer } from '../../components/layout/PageContainer';
import { HasRole } from '../../components/auth/HasRole.tsx';
import type { User } from '../../types/auth';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export default function DashboardHome() {
  const user = getStoredUser();

  return (
    <PageContainer title={`Welcome, ${user?.name ?? 'User'}`}>
      <p className="mb-4 text-slate-600 dark:text-slate-400">
        You are logged in as <span className="font-medium capitalize text-slate-800 dark:text-slate-200">{user?.role}</span>.
      </p>

      <HasRole roles={['librarian', 'author']}>
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
          You are a librarian or author — you can manage books and reset passwords.
        </div>
      </HasRole>
      <HasRole roles={['student']}>
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
          You are a student — you can browse and issue books.
        </div>
      </HasRole>
    </PageContainer>
  );
}
