import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { analysisApi } from "../api/analysisApi";
import { reportApi } from "../api/reportApi";
import { Button } from "../components/Button";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MissingSkillTag } from "../components/MissingSkillTag";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { ScoreCard } from "../components/ScoreCard";
import { ScoreRing } from "../components/ScoreRing";
import { SectionCard } from "../components/SectionCard";
import { SkillTag } from "../components/SkillTag";
import { Textarea } from "../components/Textarea";

export function AnalysisPage() {
  const { resumeId } = useParams();
  const hasStarted = useRef(false);
  const parsedResumeId = Number(resumeId);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchError, setJobMatchError] = useState("");
  const [analysisTimedOut, setAnalysisTimedOut] = useState(false);

  const mutation = useMutation({
    mutationFn: analysisApi.analyzeResume,
    onSettled: () => setAnalysisTimedOut(false),
  });

  const jobMatchMutation = useMutation({
    mutationFn: analysisApi.jobMatch,
  });

  const reportHistoryQuery = useQuery({
    queryKey: ["reports"],
    queryFn: reportApi.history,
    enabled: analysisTimedOut || Boolean(mutation.error),
    refetchOnWindowFocus: false,
  });

  const generatedReport = reportHistoryQuery.data?.find((report) => report.resume_id === parsedResumeId);

  useEffect(() => {
    if (!hasStarted.current && Number.isFinite(parsedResumeId) && parsedResumeId > 0) {
      hasStarted.current = true;
      mutation.mutate(parsedResumeId);
    }
  }, [parsedResumeId]);

  useEffect(() => {
    if (!mutation.isPending) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setAnalysisTimedOut(true);
    }, 20000);
    return () => window.clearTimeout(timeout);
  }, [mutation.isPending]);

  function handleJobMatchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJobMatchError("");
    if (!jobTitle.trim() || jobDescription.trim().length < 20) {
      setJobMatchError("Enter a job title and at least 20 characters of job description.");
      return;
    }
    jobMatchMutation.mutate({
      resume_id: parsedResumeId,
      job_title: jobTitle,
      job_description: jobDescription,
    });
  }

  return (
    <>
      <PageHeader eyebrow="ATS analysis" title="Resume Analysis" description="AI scoring, skill signals, strengths, weaknesses, and target job matching in one workspace." />
      {mutation.isPending && !analysisTimedOut ? <LoadingState message="Analyzing your resume. This may take a few seconds..." /> : null}
      {(analysisTimedOut || mutation.error) ? (
        <SectionCard title="Analysis is taking longer than expected" description="The backend may have already saved the report. You can open it from here if it is available.">
          {reportHistoryQuery.isLoading ? <LoadingState message="Checking generated reports..." /> : null}
          {generatedReport ? (
            <Link className="app-action-primary" to={`/reports/${generatedReport.report_id ?? generatedReport.id}`}>
              View generated report
            </Link>
          ) : (
            <p className="text-sm text-muted">No generated report found yet. You can wait a little longer or open the Reports page.</p>
          )}
        </SectionCard>
      ) : null}
      {mutation.error ? <ErrorState message={mutation.error.message} /> : null}
      {mutation.data ? (
        <div className="space-y-4">
          <section className="glass-panel grid min-w-0 gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] xl:items-center">
            <div className="min-w-0">
              <ScoreRing value={mutation.data.ats_score} label="ATS score" caption="Primary compatibility signal from the uploaded resume." size="lg" />
            </div>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ScoreCard helper="Combined resume quality signal" label="Overall" value={mutation.data.overall_score} />
                <ScoreCard helper="Only populated when a job description is used" label="Job Match" value={mutation.data.job_match_score} />
              </div>
              <div className="space-y-3">
                <ProgressBar label="Readability" value={mutation.data.readability_score} />
                <ProgressBar label="Grammar" value={mutation.data.grammar_score} />
              </div>
            </div>
          </section>
          <div className="grid gap-4 lg:grid-cols-2">
            <ListSection title="Top Strengths" items={mutation.data.strengths} />
            <ListSection title="Priority Gaps" items={mutation.data.weaknesses} />
          </div>
          <SectionCard title="Score Breakdown" description="Points awarded by the current rule-based scoring engine.">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(mutation.data.score_breakdown).map(([key, item]) => (
                <div className="rounded-card border border-line bg-white p-4 shadow-sm" key={key}>
                  <div className="flex min-w-0 justify-between gap-3 text-sm font-semibold text-ink">
                    <span className="capitalize">{key.replaceAll("_", " ")}</span>
                    <span className="shrink-0">{item.points}/{item.max_points}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.reason}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Skills Insights" description="Detected skills and priority gaps based on current ATS and keyword checks.">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">Skills Found</h3>
                <div className="flex flex-wrap gap-2">
                  {mutation.data.skills_found.length ? mutation.data.skills_found.map((skill) => <SkillTag category={skill.skill_category} key={skill.skill_name} name={skill.skill_name} />) : <p className="text-sm text-muted">No predefined skills detected.</p>}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {mutation.data.missing_skills.length ? mutation.data.missing_skills.map((skill) => <MissingSkillTag key={skill.skill_name} name={skill.skill_name} priority={skill.priority} />) : <p className="text-sm text-muted">No missing skills recorded for this analysis.</p>}
                </div>
              </div>
            </div>
          </SectionCard>
          <ListSection title="Recommendations" items={mutation.data.suggestions} />
          <SectionCard title="Job Match" description="Compare this resume with a target job description.">
            <form className="space-y-4" onSubmit={handleJobMatchSubmit}>
              {(jobMatchError || jobMatchMutation.error) ? <ErrorState message={jobMatchError || jobMatchMutation.error?.message || "Job match failed"} /> : null}
              <label className="label" htmlFor="job-title">
                Job title
                <input id="job-title" className="form-field mt-1.5" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="FastAPI Backend Developer" />
              </label>
              <Textarea label="Job description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the role requirements, skills, and responsibilities here." />
              <Button disabled={jobMatchMutation.isPending} type="submit">{jobMatchMutation.isPending ? "Matching..." : "Run Job Match"}</Button>
            </form>
            {jobMatchMutation.data ? (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <ScoreCard helper="Skill and keyword alignment" label="Match percentage" value={jobMatchMutation.data.match_percentage} />
                  <div className="rounded-card border border-line bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-ink">Job match insight</p>
                    <p className="mt-2 text-sm leading-6 text-muted">Use missing skills and missing keywords below to prioritize resume updates for this role.</p>
                  </div>
                </div>
                <TagGroup title="Matched skills" items={jobMatchMutation.data.matched_skills} type="skill" />
                <TagGroup title="Missing skills" items={jobMatchMutation.data.missing_skills} type="missing" />
                <TagGroup title="Matched keywords" items={jobMatchMutation.data.matched_keywords} type="skill" />
                <TagGroup title="Missing keywords" items={jobMatchMutation.data.missing_keywords} type="missing" />
                <InlineList title="Job Match Suggestions" items={jobMatchMutation.data.suggestions} />
              </div>
            ) : null}
          </SectionCard>
          <Link className="app-action-primary" to={`/reports/${mutation.data.report_id}`}>
            View generated report
          </Link>
        </div>
      ) : null}
    </>
  );
}

function TagGroup({ title, items, type }: { title: string; items: string[]; type: "skill" | "missing" }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.length ? items.map((item) => type === "skill" ? <SkillTag key={item} name={item} /> : <MissingSkillTag key={item} name={item} />) : <p className="text-sm text-muted">None found.</p>}
      </div>
    </div>
  );
}

function InlineList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
      {items.length ? (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted">None recorded.</p>
      )}
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
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
