import type { ReactNode } from 'react';

interface PageContainerProps {
  title?: string;
  children: ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-slate-50 dark:bg-slate-900">
      <div className="p-6">
        {title && (
          <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
}
