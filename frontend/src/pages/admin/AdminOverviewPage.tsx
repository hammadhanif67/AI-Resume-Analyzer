import { useQuery } from "@tanstack/react-query";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { SectionCard } from "../../components/SectionCard";
import { StatCard } from "../../components/StatCard";

export function AdminOverviewPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: adminApi.getAdminOverview });

  return (
    <>
      <PageHeader eyebrow="Admin control center" title="System Overview" description="Monitor users, resume intake, generated reports, and backend health." />
      {isLoading ? <LoadingState message="Loading admin overview..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total users" value={data.total_users} />
            <StatCard label="Total resumes" value={data.total_resumes} />
            <StatCard label="Total reports" value={data.total_reports} />
            <StatCard label="Backend health" value={data.backend_status} />
          </div>
          <SectionCard title="Recent uploads">
            {data.latest_uploads.length ? (
              <AdminTable headers={["File", "User", "Status"]} rows={data.latest_uploads.map((resume) => [<span className="font-semibold text-ink">{resume.file_name}</span>, resume.user.email, resume.processing_status])} />
            ) : <EmptyState title="No uploads" message="Resume uploads will appear here." />}
          </SectionCard>
          <SectionCard title="Recent reports">
            {data.latest_reports.length ? (
              <AdminTable headers={["Resume", "User", "ATS"]} rows={data.latest_reports.map((report) => [<span className="font-semibold text-ink">{report.resume_name}</span>, report.user.email, `ATS ${Math.round(report.ats_score)}`])} />
            ) : <EmptyState title="No reports" message="Analysis reports will appear here." />}
          </SectionCard>
        </div>
      ) : null}
    </>
  );
}
