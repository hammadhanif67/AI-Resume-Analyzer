import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
