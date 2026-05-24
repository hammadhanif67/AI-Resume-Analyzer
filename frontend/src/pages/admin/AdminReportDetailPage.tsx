import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { adminApi } from "../../api/adminApi";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { MissingSkillTag } from "../../components/MissingSkillTag";
import { PageHeader } from "../../components/PageHeader";
import { ReportSummaryPanel } from "../../components/ReportSummaryPanel";
import { SectionCard } from "../../components/SectionCard";
import { SkillTag } from "../../components/SkillTag";

export function AdminReportDetailPage() {
  const { reportId } = useParams();
  const parsedReportId = Number(reportId);
  const hasValidReportId = Number.isFinite(parsedReportId) && parsedReportId > 0;
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-report", parsedReportId],
    queryFn: () => adminApi.getAdminReport(parsedReportId),
    enabled: hasValidReportId,
  });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Report Detail" description="Detailed AI analysis report across users." />
      {!hasValidReportId ? <ErrorState message="Invalid admin report link. Open a report from the Admin Reports page." /> : null}
      {isLoading ? <LoadingState message="Loading admin report..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data ? (
        <div className="space-y-4">
          <ReportSummaryPanel
            atsScore={data.ats_score}
            backLabel="Back to admin reports"
            backTo="/admin/reports"
            caption="Combined report signal for admin review."
            jobMatchScore={data.job_match_score}
            meta={[
              `User: ${data.user?.name ?? "Unknown"} (${data.user?.email ?? "No email"})`,
              `Created ${new Date(data.created_at).toLocaleString()}`,
            ]}
            overallScore={data.overall_score}
            title={data.resume?.file_name ?? data.resume_file_name ?? `Report #${data.id}`}
          />

          <SectionCard title="Skills Found">
            <div className="flex flex-wrap gap-2">
              {data.skills_found.length ? data.skills_found.map((skill) => <SkillTag category={skill.skill_category} key={skill.skill_name} name={skill.skill_name} />) : <p className="text-sm text-muted">None recorded.</p>}
            </div>
          </SectionCard>

          <SectionCard title="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {data.missing_skills.length ? data.missing_skills.map((skill) => <MissingSkillTag key={skill.skill_name} name={skill.skill_name} priority={skill.priority} />) : <p className="text-sm text-muted">None recorded.</p>}
            </div>
          </SectionCard>

          <AdminReportList title="Strengths" items={data.strengths} />
          <AdminReportList title="Weaknesses" items={data.weaknesses} />
          <AdminReportList title="Suggestions" items={data.suggestions} />
        </div>
      ) : null}
    </>
  );
}

function AdminReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <SectionCard title={title}>
      {items.length ? (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted">None recorded.</p>
      )}
    </SectionCard>
  );
}
