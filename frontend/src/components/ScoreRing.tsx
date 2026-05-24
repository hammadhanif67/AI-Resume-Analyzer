interface ScoreRingProps {
  value: number;
  label: string;
  caption?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-20 w-20 text-xl",
  md: "h-28 w-28 text-3xl",
  lg: "h-36 w-36 text-4xl",
};

export function ScoreRing({ value, label, caption, size = "md" }: ScoreRingProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value || 0)));
  const color = safeValue >= 75 ? "#0d9488" : safeValue >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
      <div
        className={`${sizes[size]} grid shrink-0 place-items-center rounded-full`}
        style={{ background: `conic-gradient(${color} ${safeValue * 3.6}deg, #e8eef6 0deg)` }}
      >
        <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-white shadow-inner">
          <span className="font-bold text-ink">{safeValue}</span>
        </div>
      </div>
      <div className="min-w-0 text-center sm:text-left">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {caption ? <p className="mt-1 text-sm leading-6 text-muted">{caption}</p> : null}
      </div>
    </div>
  );
}
