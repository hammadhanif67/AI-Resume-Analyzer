import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { PublicIcon } from "./PublicIcon";
import { ProgressBar } from "./ProgressBar";

interface ReportSummaryPanelProps {
  title: string;
  meta: string[];
  backTo: string;
  backLabel: string;
  actions?: ReactNode;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  caption: string;
}

export function ReportSummaryPanel({ actions, atsScore, backLabel, backTo, caption, jobMatchScore, meta, overallScore, title }: ReportSummaryPanelProps) {
  return (
    <section className="card audit-panel p-5 sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800" to={backTo}>
            <PublicIcon className="h-4 w-4 rotate-180" name="arrowRight" />
            {backLabel}
          </Link>
          <h2 className="mt-4 break-words text-xl font-bold text-ink sm:text-2xl">{title}</h2>
          <div className="mt-2 grid gap-1 text-sm font-medium leading-6 text-muted">
            {meta.map((item) => <p className="break-words" key={item}>{item}</p>)}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-stretch">
        <div className="rounded-xl border border-slate-200/80 bg-white/78 p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ScoreDonut value={overallScore} />
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase text-brand-700">Audit score</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{Math.round(overallScore)}/100</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{caption}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <ScoreMetric label="Overall" helper="Combined score" value={overallScore} />
          <ScoreMetric label="ATS" helper="ATS rule score" value={atsScore} />
          <ScoreMetric label="Job Match" helper="Job description alignment" value={jobMatchScore} />
        </div>
      </div>
    </section>
  );
}

function ScoreDonut({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value || 0)));
  const color = safeValue >= 75 ? "#0d9488" : safeValue >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)]" style={{ background: `conic-gradient(${color} ${safeValue * 3.6}deg, #e8eef6 0deg)` }}>
      <div className="grid h-[76%] w-[76%] place-items-center rounded-full bg-white shadow-inner">
        <span className="text-3xl font-bold text-ink">{safeValue}</span>
      </div>
    </div>
  );
}

function ScoreMetric({ helper, label, value }: { helper: string; label: string; value: number }) {
  const rounded = Math.round(value || 0);

  return (
    <article className="score-metric-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted">{label}</p>
          <p className="mt-1 text-xs font-medium leading-5 text-muted">{helper}</p>
        </div>
        <p className="shrink-0 text-3xl font-bold text-ink">{rounded}</p>
      </div>
      <div className="mt-4">
        <ProgressBar value={rounded} />
      </div>
    </article>
  );
}
