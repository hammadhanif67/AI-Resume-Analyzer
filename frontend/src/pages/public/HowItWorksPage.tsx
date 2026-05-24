import { CTASection, FeatureCard, ProcessStepCard, PublicSection, SectionHeader } from "../../components/PublicUI";
import type { PublicIconName } from "../../components/PublicIcon";

const steps = [
  { icon: "upload" as PublicIconName, title: "Upload resume", text: "Add a PDF or DOCX resume from the protected app experience.", tone: "brand" as const },
  { icon: "fileText" as PublicIconName, title: "Parse content", text: "The system reads sections, text, skills, and structure before scoring.", tone: "accent" as const },
  { icon: "gauge" as PublicIconName, title: "Generate ATS score", text: "Scoring rules evaluate completeness, readability, keywords, and format.", tone: "violet" as const },
  { icon: "target" as PublicIconName, title: "Compare job signals", text: "Optional job descriptions reveal match strength and missing keywords.", tone: "amber" as const },
  { icon: "sparkles" as PublicIconName, title: "Review improvements", text: "Recommendations explain what to fix and why it affects resume quality.", tone: "brand" as const },
  { icon: "download" as PublicIconName, title: "Download report", text: "Save analysis outcomes as a PDF report for review or preparation.", tone: "accent" as const },
];

const assurance = [
  { icon: "shield" as PublicIconName, title: "Protected handoff", text: "Public pages explain the journey; private routes still handle upload, reports, and account data.", tone: "brand" as const },
  { icon: "clock" as PublicIconName, title: "Fast feedback loop", text: "The page sets expectations for a quick score, clear categories, and practical suggestions.", tone: "accent" as const },
  { icon: "badgeCheck" as PublicIconName, title: "No hidden detours", text: "Routes stay simple: learn the flow, sign up, upload, analyze, and download.", tone: "violet" as const },
];

export function HowItWorksPage() {
  return (
    <main>
      <PublicSection>
        <SectionHeader
          eyebrow="How It Works"
          icon="activity"
          text="A direct six-step journey from resume file to report, designed to stay clear on desktop, tablet, and mobile."
          title="From upload to professional resume intelligence"
        />
        <div className="mt-9 grid items-stretch gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <ProcessStepCard hasConnector={index < steps.length - 1 && (index + 1) % 3 !== 0} key={step.title} step={index + 1} {...step} />
          ))}
        </div>
      </PublicSection>

      <PublicSection tone="muted">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeader align="left" eyebrow="Flow quality" icon="checkCircle" text="The process cards avoid decorative clutter and explain exactly what users can expect after each action." title="Clear enough for first-time users, compact enough for quick scanning" />
          <div className="grid gap-4 sm:grid-cols-3">
            {assurance.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </PublicSection>

      <CTASection
        primaryLabel="Create Account"
        primaryTo="/signup"
        secondaryLabel="Explore Features"
        secondaryTo="/features"
        text="When the process is clear, users know exactly why they are uploading and what they will get back."
        title="Start the analysis journey with confidence."
      />
    </main>
  );
}
