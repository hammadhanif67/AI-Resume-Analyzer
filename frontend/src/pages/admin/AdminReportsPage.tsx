import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";

export function AdminReportsPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-reports"], queryFn: adminApi.getAdminReports });
  return (
    <>
      <PageHeader eyebrow="Admin" title="Reports" description="Analysis reports across all users with score visibility." />
      {isLoading ? <LoadingState message="Loading reports..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No reports" message="Generated reports will appear here." /> : null}
      {data?.length ? <AdminTable headers={["User", "Resume", "Overall", "ATS", "Job Match", "Date", "Action"]} rows={data.map((report) => [report.user.email, <span className="font-semibold text-ink">{report.resume_name}</span>, Math.round(report.overall_score), Math.round(report.ats_score), Math.round(report.job_match_score), new Date(report.created_at).toLocaleDateString(), <Link className="app-table-action" to={`/admin/reports/${report.report_id ?? report.id}`}>View</Link>])} /> : null}
    </>
  );
}
