import { ProgressBar } from "./ProgressBar";

interface ScoreCardProps {
  label: string;
  value: number;
  helper?: string;
}

export function ScoreCard({ label, value, helper }: ScoreCardProps) {
  const rounded = Math.round(value);

  return (
    <article className="card h-full min-h-32 p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 overflow-hidden">
          <p className="break-words text-sm font-medium text-muted">{label}</p>
          {helper ? <p className="mt-1 break-words text-xs leading-5 text-muted">{helper}</p> : null}
        </div>
        <p className="shrink-0 whitespace-nowrap text-3xl font-bold tracking-normal text-ink">{rounded}</p>
      </div>
      <div className="mt-4">
        <ProgressBar value={rounded} />
      </div>
    </article>
  );
}
