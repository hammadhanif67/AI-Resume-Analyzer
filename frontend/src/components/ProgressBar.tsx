import { cn } from "../utils/classNames";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  const color = safeValue >= 75 ? "bg-accent-600" : safeValue >= 50 ? "bg-warning-700" : "bg-danger-700";

  return (
    <div>
      {label ? (
        <div className="mb-1 flex justify-between text-xs font-medium text-muted">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200" aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={safeValue} role="progressbar">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
