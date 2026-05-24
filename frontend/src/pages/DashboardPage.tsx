import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { reportApi } from "../api/reportApi";
import { AdminTable } from "../components/AdminTable";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { ScoreRing } from "../components/ScoreRing";
import { StatCard } from "../components/StatCard";
import { useAuthStore } from "../store/authStore";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: reports = [] } = useQuery({ queryKey: ["reports"], queryFn: reportApi.history });
  const totalReports = reports.length;
  const totalResumes = new Set(reports.map((report) => report.resume_id)).size;
  const latestReport = reports[0];

  return (
    <>
      <PageHeader eyebrow="Workspace" title={`Welcome back, ${user?.name ?? "User"}`} description="Your resume intelligence workspace for uploads, ATS scoring, and insights." />
      <section className="glass-panel audit-panel mb-5 overflow-hidden p-5 sm:p-6">
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] xl:items-center">
          <div className="min-w-0">
            <h2 className="max-w-2xl text-2xl font-bold tracking-normal text-ink">Ready for a smarter resume audit?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Upload a PDF or DOCX resume. The analyzer extracts text, scores ATS quality, detects skills, and saves a polished report.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link className="app-action-primary" to="/upload">
                Upload Resume
              </Link>
              <Link className="app-action-secondary" to="/reports">
                View Reports
              </Link>
            </div>
          </div>
          <div className="score-metric-card">
            <ScoreRing
              value={latestReport?.ats_score ?? 0}
              label={latestReport ? "Latest ATS score" : "No score yet"}
              caption={latestReport ? latestReport.resume_file_name ?? "Most recent saved resume analysis." : "Upload a resume to generate your first ATS score."}
              size="md"
            />
          </div>
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total resumes" value={totalResumes} helper="Unique resumes with saved reports" />
        <StatCard label="Total reports" value={totalReports} helper="Analysis reports stored" />
        <StatCard label="Latest ATS score" value={latestReport ? Math.round(latestReport.ats_score) : "-"} helper={latestReport?.resume_file_name ?? "No report yet"} />
        <StatCard label="Latest job match" value={latestReport ? Math.round(latestReport.job_match_score) : "-"} helper="Based on saved analysis data" />
      </div>
      <section className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Latest report insight</h2>
          {latestReport ? (
            <div className="mt-4 space-y-3">
              <p className="truncate text-sm font-semibold text-ink">{latestReport.resume_file_name ?? "Recent resume report"}</p>
              <p className="text-sm leading-6 text-muted">Overall score {Math.round(latestReport.overall_score)} with ATS score {Math.round(latestReport.ats_score)}.</p>
              <Link className="app-action-primary" to={`/reports/${latestReport.report_id ?? latestReport.id}`}>
                Open latest report
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted">Your latest insight will appear here after the first analysis.</p>
          )}
        </div>
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Analysis health</h2>
          <div className="mt-5 space-y-4">
            <ProgressBar label="ATS quality" value={latestReport?.ats_score ?? 0} />
            <ProgressBar label="Job match readiness" value={latestReport?.job_match_score ?? 0} />
            <ProgressBar label="Report library activity" value={Math.min(totalReports * 20, 100)} />
          </div>
        </div>
      </section>
      <section className="card mt-5 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">Recent Reports</h2>
          <Link className="app-action-link" to="/reports">View All Reports</Link>
        </div>
        {reports.length ? (
          <AdminTable
            headers={["File name", "Overall score", "ATS score", "Job match", "Date", "Action"]}
            rows={reports.slice(0, 5).map((report) => [
              <span className="font-semibold text-ink">{report.resume_file_name ?? `Resume #${report.resume_id}`}</span>,
              Math.round(report.overall_score),
              Math.round(report.ats_score),
              `${Math.round(report.job_match_score)}%`,
              new Date(report.created_at).toLocaleDateString(),
              <Link className="app-table-action" to={`/reports/${report.report_id ?? report.id}`}>View</Link>,
            ])}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-slate-50 p-7 text-sm leading-6 text-muted">No analysis reports yet. Upload a resume to create the first one.</div>
        )}
      </section>
    </>
  );
}
