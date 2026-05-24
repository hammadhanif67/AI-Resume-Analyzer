import { CTASection, FeatureCard, PublicSection, SectionHeader, StatCard } from "../../components/PublicUI";
import type { PublicIconName } from "../../components/PublicIcon";

const stats = [
  { icon: "clipboard" as PublicIconName, value: "6", label: "Product workflow stages", tone: "brand" as const },
  { icon: "shield" as PublicIconName, value: "3", label: "Protected app zones", tone: "accent" as const },
  { icon: "database" as PublicIconName, value: "1", label: "Connected system", tone: "violet" as const },
];

const principles = [
  { icon: "rocket" as PublicIconName, title: "Built as a real product", text: "The project demonstrates authentication, uploads, ATS scoring, report generation, and admin visibility as one connected experience.", tone: "brand" as const },
  { icon: "bot" as PublicIconName, title: "AI where it helps", text: "Resume intelligence is used to explain content quality, not to hide the user behind vague automation.", tone: "accent" as const },
  { icon: "messageCircle" as PublicIconName, title: "Readable feedback", text: "Users need practical direction: what is missing, what is weak, and what should be improved first.", tone: "violet" as const },
  { icon: "code" as PublicIconName, title: "Clear technical stack", text: "React, TypeScript, Tailwind CSS, TanStack Query, FastAPI, SQLite, parsers, scoring services, and PDF reporting.", tone: "amber" as const },
];

const roadmap = [
  { icon: "barChart" as PublicIconName, title: "Richer benchmarking", text: "Future versions can compare resume quality against role families and experience levels.", tone: "brand" as const },
  { icon: "sparkles" as PublicIconName, title: "Deeper suggestions", text: "AI guidance can become more role-specific while keeping explanations transparent.", tone: "accent" as const },
  { icon: "users" as PublicIconName, title: "Team-ready admin", text: "The admin foundation can grow into stronger review, monitoring, and analytics workflows.", tone: "violet" as const },
];

export function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-fold">
        <PublicSection className="about-hero-section">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <SectionHeader
              align="left"
              eyebrow="About"
              icon="badgeCheck"
              text="AI Resume Analyzer is a final-year project presented like a focused SaaS product: practical, structured, and easy to evaluate."
              title="A resume intelligence platform with product discipline"
            />
            <div className="public-card about-hero-card">
              <div className="relative">
                <p className="text-xs font-black uppercase text-brand-700">Project position</p>
                <h2 className="mt-3 max-w-3xl text-[1.6rem] font-black leading-tight text-ink sm:text-3xl">A complete journey from resume upload to understandable decisions.</h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted">The public experience explains the same product flow users see inside the app: upload, analyze, review, and act on clear feedback.</p>
              </div>
            </div>
          </div>
        </PublicSection>

        <PublicSection className="about-stat-row pt-0" tone="plain">
          <div className="grid gap-3 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </PublicSection>
      </div>

      <PublicSection className="about-principles-section" tone="muted">
        <SectionHeader eyebrow="Product principles" icon="shield" text="The about page now speaks like a thoughtful product description instead of a generic project note." title="Practical AI, clear feedback, protected workflows" />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader align="left" eyebrow="Where it can go" icon="activity" text="The current implementation is scoped, but the interface leaves room for stronger AI and analytics without changing the story." title="A foundation that can scale after the FYP" />
          <div className="grid gap-4 sm:grid-cols-3">
            {roadmap.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </PublicSection>

      <CTASection
        primaryLabel="Contact Team"
        primaryTo="/contact"
        secondaryLabel="See Features"
        secondaryTo="/features"
        text="Explore how the public promise connects to the protected resume analysis workflow."
        title="Want to understand the system in action?"
      />
    </main>
  );
}
