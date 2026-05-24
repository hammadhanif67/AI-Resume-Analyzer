import { Link } from "react-router-dom";

import type { ReportSummary } from "../types/report";
import { ProgressBar } from "./ProgressBar";

interface ReportCardProps {
  report: ReportSummary;
}

export function ReportCard({ report }: ReportCardProps) {
  const reportId = report.report_id || report.id;
  const hasValidReportId = Number.isFinite(reportId) && reportId > 0;

  return (
    <article className="card h-full p-5 transition hover:-translate-y-px hover:border-brand-200 hover:shadow-soft">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-ink">{report.resume_file_name ?? `Resume #${report.resume_id}`}</h3>
          <p className="mt-1 text-sm text-muted">Created {new Date(report.created_at).toLocaleDateString()}</p>
        </div>
        {hasValidReportId ? (
          <Link className="app-action-primary shrink-0" to={`/reports/${reportId}`}>
            View report
          </Link>
        ) : (
          <span className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-muted">
            Report unavailable
          </span>
        )}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ProgressBar label="ATS score" value={report.ats_score} />
        <ProgressBar label="Job match" value={report.job_match_score} />
      </div>
    </article>
  );
}
