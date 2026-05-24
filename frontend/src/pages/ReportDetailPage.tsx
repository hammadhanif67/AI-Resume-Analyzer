import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { reportApi } from "../api/reportApi";
import { Button } from "../components/Button";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MissingSkillTag } from "../components/MissingSkillTag";
import { PageHeader } from "../components/PageHeader";
import { ReportSummaryPanel } from "../components/ReportSummaryPanel";
import { SectionCard } from "../components/SectionCard";
import { SkillTag } from "../components/SkillTag";

export function ReportDetailPage() {
  const { reportId } = useParams();
  const parsedReportId = Number(reportId);
  const hasValidReportId = Number.isFinite(parsedReportId) && parsedReportId > 0;
  const { data, error, isLoading } = useQuery({
    queryKey: ["report", parsedReportId],
    queryFn: () => reportApi.detail(parsedReportId),
    enabled: hasValidReportId,
  });

  async function handleDownload() {
    const blob = await reportApi.download(parsedReportId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-analysis-report-${parsedReportId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader eyebrow="Saved report" title="Report Detail" description="A professional resume audit report with scoring, skills, and recommendations." />
      {!hasValidReportId ? <ErrorState message="Invalid report link. Open a report from the Reports page." /> : null}
      {isLoading ? <LoadingState message="Loading report..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data ? (
        <div className="space-y-5">
          <ReportSummaryPanel
            actions={<Button onClick={handleDownload}>Download PDF</Button>}
            atsScore={data.ats_score}
            backLabel="Back to reports"
            backTo="/reports"
            caption="Combined assessment from ATS, readability, grammar, and job alignment."
            jobMatchScore={data.job_match_score}
            meta={[`Created ${new Date(data.created_at).toLocaleString()}`]}
            overallScore={data.overall_score}
            title={data.resume?.file_name ?? `Report #${data.id}`}
          />
          <SectionCard title="Score Breakdown" description="Why marks were given or lost.">
            <div className="grid gap-3 lg:grid-cols-2">
              {Object.entries(data.score_breakdown).map(([key, item]) => (
                <div className="score-metric-card" key={key}>
                  <div className="flex min-w-0 justify-between gap-3 text-sm font-medium text-ink">
                    <span className="capitalize">{key.replaceAll("_", " ")}</span>
                    <span className="shrink-0">{item.points}/{item.max_points}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.reason}</p>
                </div>
              ))}
            </div>
          </SectionCard>
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
          <ReportList title="Strengths" items={data.strengths} />
          <ReportList title="Weaknesses" items={data.weaknesses} />
          <ReportList title="Suggestions" items={data.suggestions} />
        </div>
      ) : null}
    </>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
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
