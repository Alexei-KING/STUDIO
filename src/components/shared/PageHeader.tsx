import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode; // For action buttons or other elements
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
