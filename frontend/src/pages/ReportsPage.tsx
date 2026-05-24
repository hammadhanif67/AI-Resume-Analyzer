import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { reportApi } from "../api/reportApi";
import { AdminTable } from "../components/AdminTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";

export function ReportsPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["reports"], queryFn: reportApi.history });

  return (
    <>
      <PageHeader eyebrow="Report library" title="Reports" description="Previous analysis reports for the current user." />
      {isLoading ? <LoadingState message="Loading reports..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No reports yet" message="Upload and analyze a resume to create your first report." /> : null}
      {data?.length ? (
        <AdminTable
          headers={["File name", "Overall", "ATS", "Job Match", "Date", "Action"]}
          rows={data.map((report) => [
            <span className="font-semibold text-ink">{report.resume_file_name ?? `Resume #${report.resume_id}`}</span>,
            Math.round(report.overall_score),
            Math.round(report.ats_score),
            `${Math.round(report.job_match_score)}%`,
            new Date(report.created_at).toLocaleDateString(),
            <Link className="app-table-action" to={`/reports/${report.report_id ?? report.id}`}>View</Link>,
          ])}
        />
      ) : null}
    </>
  );
}
