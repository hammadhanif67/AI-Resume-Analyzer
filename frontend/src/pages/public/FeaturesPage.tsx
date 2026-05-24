import { CTASection, FeatureCard, PublicSection, SectionHeader, StatCard } from "../../components/PublicUI";
import { PublicIcon, type PublicIconName } from "../../components/PublicIcon";

const featureGroups = [
  { icon: "gauge" as PublicIconName, title: "ATS scoring", text: "Evaluate structure, section quality, keyword coverage, readability, and formatting signals.", meta: "Score with context", tone: "brand" as const },
  { icon: "upload" as PublicIconName, title: "Resume upload", text: "Support PDF and DOCX uploads while keeping the existing protected processing flow intact.", meta: "Existing pipeline", tone: "accent" as const },
  { icon: "target" as PublicIconName, title: "Job matching", text: "Compare a resume against a target role and surface alignment, gaps, and missing terms.", meta: "Role-specific checks", tone: "violet" as const },
  { icon: "users" as PublicIconName, title: "Skill extraction", text: "Group detected technical and soft skills so users can see what their resume communicates.", meta: "Readable skill signals", tone: "amber" as const },
  { icon: "search" as PublicIconName, title: "Missing skills", text: "Highlight priority gaps that may weaken ATS visibility or recruiter scanning.", meta: "Gap-first feedback", tone: "brand" as const },
  { icon: "fileText" as PublicIconName, title: "PDF reports", text: "Turn saved analysis into professional reports for review, preparation, and submission notes.", meta: "Export-ready", tone: "accent" as const },
];

const metrics = [
  { icon: "barChart" as PublicIconName, value: "6", label: "Analysis categories", tone: "brand" as const },
  { icon: "sparkles" as PublicIconName, value: "4", label: "Recommendation areas", tone: "violet" as const },
  { icon: "shield" as PublicIconName, value: "100%", label: "Protected app handoff", tone: "accent" as const },
];

const detailRows = [
  { icon: "clipboard" as PublicIconName, title: "Content structure", text: "Checks sections, length, and core information before the score is shown.", tone: "brand" as const },
  { icon: "activity" as PublicIconName, title: "Quality signals", text: "Pairs readability, keyword coverage, and formatting signals with clear context.", tone: "violet" as const },
  { icon: "badgeCheck" as PublicIconName, title: "Report workflow", text: "Keeps analysis outcomes ready for saved reports and PDF download.", tone: "amber" as const },
];

export function FeaturesPage() {
  return (
    <main>
      <PublicSection>
        <SectionHeader
          eyebrow="Features"
          icon="rocket"
          text="A compact product surface for scoring, matching, reporting, and understanding resume quality."
          title="Everything the public site promises maps to the existing app workflow"
        />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureGroups.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="muted">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-xl">
            <SectionHeader align="left" eyebrow="What users see" icon="search" text="A cleaner signal panel groups the most useful feedback in a compact, scannable format instead of oversized stacked cards." title="Signals that help users decide what to improve first" />
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {["Clear score logic", "Readable fixes", "Export-ready result"].map((item) => (
                <p className="flex items-center gap-2 text-sm font-black text-slate-700" key={item}>
                  <PublicIcon className="h-4 w-4 text-accent-700" name="checkCircle" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {detailRows.map((row, index) => (
              <SignalCard key={row.title} priority={index + 1} {...row} />
            ))}
          </div>
        </div>
      </PublicSection>

      <PublicSection>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>
      </PublicSection>

      <CTASection
        primaryLabel="Try Analysis"
        primaryTo="/signup"
        secondaryLabel="See Process"
        secondaryTo="/how-it-works"
        text="Move from high-level features to the actual step-by-step resume analysis journey."
        title="Feature list se next action tak flow clear hai."
      />
    </main>
  );
}

function SignalCard({ icon, priority, text, title, tone }: { icon: PublicIconName; priority: number; text: string; title: string; tone: "brand" | "violet" | "amber" }) {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-600 ring-amber-200/80",
    brand: "bg-brand-50 text-brand-700 ring-brand-200/80",
    violet: "bg-violet-50 text-violet-600 ring-violet-200/80",
  };

  return (
    <article className="public-card grid gap-4 p-4 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-center">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ring-1 ${toneClasses[tone]}`}>
        <PublicIcon className="h-5 w-5" name={icon} />
      </span>
      <div className="min-w-0">
        <h3 className="text-base font-black leading-snug text-ink">{title}</h3>
        <p className="mt-1.5 text-sm font-medium leading-6 text-muted">{text}</p>
      </div>
      <p className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-3 text-sm font-black text-brand-700 shadow-sm sm:justify-self-end">
        <PublicIcon className="h-4 w-4" name="checkCircle" />
        Priority {priority}
      </p>
    </article>
  );
}
