interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="glass-panel border-dashed p-6 text-center sm:p-8">
      <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">AI</div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}
