import { Link } from "react-router-dom";

import { PublicIcon, type PublicIconName } from "../../components/PublicIcon";
import { CTASection, FeatureCard, ProcessStepCard, PublicSection, SectionHeader, StatCard } from "../../components/PublicUI";
import { useAuthStore } from "../../store/authStore";

const stats = [
  { icon: "clipboard" as PublicIconName, value: "50K+", label: "Resumes analyzed", tone: "brand" as const },
  { icon: "target" as PublicIconName, value: "92%", label: "ATS scoring coverage", tone: "accent" as const },
  { icon: "bot" as PublicIconName, value: "12+", label: "Analysis signals", tone: "violet" as const },
  { icon: "clock" as PublicIconName, value: "24/7", label: "Self-serve access", tone: "amber" as const },
];

const features = [
  { icon: "gauge" as PublicIconName, title: "ATS score clarity", text: "See the structure, keyword, readability, and section signals behind the score.", meta: "Transparent scoring", tone: "brand" as const },
  { icon: "target" as PublicIconName, title: "Job match guidance", text: "Compare resume language with a role and spot the gaps that matter first.", meta: "Role-aware feedback", tone: "accent" as const },
  { icon: "sparkles" as PublicIconName, title: "Actionable suggestions", text: "Turn analysis into practical edits for bullets, skills, and missing content.", meta: "Less vague advice", tone: "violet" as const },
  { icon: "fileText" as PublicIconName, title: "Downloadable reports", text: "Save analysis outcomes as polished PDF reports for review and preparation.", meta: "Ready to export", tone: "amber" as const },
];

const steps = [
  { icon: "upload" as PublicIconName, title: "Upload your resume", text: "Add a PDF or DOCX file through the existing protected upload flow.", tone: "brand" as const },
  { icon: "bot" as PublicIconName, title: "AI reads the content", text: "The system extracts sections, skills, readability, and formatting signals.", tone: "accent" as const },
  { icon: "barChart" as PublicIconName, title: "Review clear results", text: "Use ATS score, match percentage, and missing skills to plan improvements.", tone: "violet" as const },
  { icon: "download" as PublicIconName, title: "Save the report", text: "Download report-ready insights from saved analysis results.", tone: "amber" as const },
];

const trustItems = [
  { icon: "shield" as PublicIconName, title: "Protected workflows", text: "Auth-protected uploads and reports keep user data inside the app flow.", tone: "brand" as const },
  { icon: "badgeCheck" as PublicIconName, title: "Evaluator-friendly", text: "Built to demonstrate a complete product journey, not just a single form.", tone: "accent" as const },
  { icon: "users" as PublicIconName, title: "Human-readable output", text: "Scores are paired with explanations so users know what to fix next.", tone: "violet" as const },
];

export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activityPath = isAuthenticated ? "/upload" : "/login";

  return (
    <main>
      <section className="public-container grid items-center gap-8 pb-8 pt-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pb-10 lg:pt-11">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-black uppercase text-brand-700 shadow-sm">
            <PublicIcon className="h-3.5 w-3.5" name="sparkles" />
            AI-powered resume intelligence
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] text-ink sm:text-5xl lg:text-[3.35rem]">
            Resume feedback that is clear, fast, and useful.
          </h1>
          <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-700">
            Score your resume, understand ATS gaps, and get focused next steps before applying.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="public-button bg-ink text-white shadow-soft hover:bg-brand-900" to={activityPath}>
              <PublicIcon name="upload" />
              Analyze Resume
            </Link>
            <Link className="public-button border border-line bg-white text-ink shadow-sm hover:bg-brand-50" to="/how-it-works">
              See Process
              <PublicIcon name="arrowRight" />
            </Link>
          </div>
          <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
            {["ATS score", "Skill gaps", "PDF report"].map((item) => (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700" key={item}>
                <PublicIcon className="h-4 w-4 text-accent-700" name="checkCircle" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <HeroPreview />
      </section>

      <PublicSection className="pt-0" tone="plain">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </PublicSection>

      <PublicSection>
        <SectionHeader
          eyebrow="Core capabilities"
          icon="rocket"
          text="Compact tools that make resume quality easier to measure, explain, and improve."
          title="A resume analysis workflow built for real decisions"
        />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="muted">
        <SectionHeader eyebrow="How it works" icon="activity" text="Four focused stages keep the flow easy to understand on every screen." title="Upload, analyze, improve, export" />
        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <ProcessStepCard hasConnector={index < steps.length - 1} key={step.title} step={index + 1} {...step} />
          ))}
        </div>
      </PublicSection>

      <PublicSection>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeader align="left" eyebrow="Trust layer" icon="shield" text="The public website now reflects the same product discipline as the protected app: clear routes, clear data flow, and no mystery around what happens next." title="Professional enough for users, structured enough for evaluation" />
          <div className="grid gap-4 sm:grid-cols-3">
            {trustItems.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </PublicSection>

      <CTASection
        primaryLabel="Start Free Analysis"
        primaryTo={activityPath}
        secondaryLabel="View Features"
        secondaryTo="/features"
        text="Use AI-backed scoring and practical recommendations to make your resume easier to read, match, and improve."
        title="Ready to make your resume sharper?"
      />
    </main>
  );
}

function HeroPreview() {
  return (
    <div className="relative min-w-0">
      <div className="rounded-[1rem] border border-line bg-white p-3 shadow-soft">
        <div className="rounded-[0.85rem] border border-line bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
                <PublicIcon className="h-5 w-5" name="fileText" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black text-ink">Resume audit</p>
                <p className="truncate text-xs font-semibold text-muted">Senior Backend Developer.pdf</p>
              </div>
            </div>
            <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-black text-success-700">Ready</span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[0.76fr_1.24fr]">
            <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full" style={{ background: "conic-gradient(#14b8a6 0 92%, #e2e8f0 92% 100%)" }}>
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                  <div className="text-center">
                    <p className="text-2xl font-black leading-none text-ink">92</p>
                    <p className="mt-1 text-xs font-black uppercase text-muted">ATS</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-black text-ink">Excellent structure</h3>
              </div>
            </div>

            <div className="grid gap-3">
              <AuditBar label="Readability" tone="accent" value={87} />
              <AuditBar label="Job match" tone="brand" value={72} />
              <AuditBar label="Keyword coverage" tone="violet" value={81} />
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <HeroMetric icon="shield" label="ATS-safe" />
            <HeroMetric icon="target" label="Role match" />
            <HeroMetric icon="download" label="PDF report" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditBar({ label, tone, value }: { label: string; tone: "accent" | "brand" | "violet"; value: number }) {
  const tones = {
    accent: "bg-accent-600",
    brand: "bg-brand-600",
    violet: "bg-violet-600",
  };

  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-ink">{label}</p>
        <p className="text-sm font-black text-slate-600">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function HeroMetric({ icon, label }: { icon: PublicIconName; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-sm">
      <PublicIcon className="h-4 w-4 text-brand-700" name={icon} />
      <span className="text-sm font-black text-slate-700">{label}</span>
    </div>
  );
}
