import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  action?: ReactNode;
}

export function StatCard({ label, value, helper, action }: StatCardProps) {
  return (
    <article className="card flex h-full flex-col border-slate-200/80 p-4 transition hover:-translate-y-px hover:border-brand-200 hover:shadow-soft">
      <p className="min-w-0 text-xs font-bold text-muted">{label}</p>
      <div className="mt-2 flex min-w-0 items-end justify-between gap-3">
        <p className="min-w-0 break-words text-2xl font-bold tracking-normal text-ink">{value}</p>
        {action}
      </div>
      {helper ? <p className="mt-2 min-w-0 text-xs leading-5 text-muted">{helper}</p> : null}
    </article>
  );
}
