import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import { contactApi } from "../../api/contactApi";
import { ErrorState } from "../../components/ErrorState";
import { PublicIcon, type PublicIconName } from "../../components/PublicIcon";
import { CTASection, IconBadge, PublicSection, SectionHeader } from "../../components/PublicUI";

const supportItems = [
  { icon: "headphones" as PublicIconName, title: "Fast support", text: "Send a message and get a clear response path.", tone: "brand" as const },
  { icon: "shield" as PublicIconName, title: "Private by design", text: "Support messages stay inside the existing contact flow.", tone: "accent" as const },
  { icon: "users" as PublicIconName, title: "User-first help", text: "Questions, feedback, and product guidance all fit here.", tone: "violet" as const },
];

const reachOptions = [
  { icon: "mail" as PublicIconName, title: "Email", text: "support@airesumeanalyzer.com", helper: "Best for account and report questions", tone: "brand" as const },
  { icon: "messageCircle" as PublicIconName, title: "Product feedback", text: "Share what felt unclear", helper: "Useful for improving analysis UX", tone: "accent" as const },
  { icon: "mapPin" as PublicIconName, title: "Location", text: "Lahore, Pakistan", helper: "Built for users worldwide", tone: "violet" as const },
];

const faqs = [
  { icon: "target" as PublicIconName, title: "How accurate is the score?", text: "It combines ATS, keyword, section, readability, and formatting signals.", tone: "brand" as const },
  { icon: "lock" as PublicIconName, title: "Is my data protected?", text: "Uploads and reports use authenticated app workflows.", tone: "accent" as const },
  { icon: "clock" as PublicIconName, title: "How long does analysis take?", text: "Most resumes complete quickly depending on file size and content.", tone: "violet" as const },
  { icon: "download" as PublicIconName, title: "Can I download reports?", text: "Yes, saved reports can be exported as PDFs from the app.", tone: "amber" as const },
];

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: contactApi.sendMessage,
    onSuccess: () => {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setValidationError("Name, email, subject, and message are required.");
      return;
    }
    mutation.mutate({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
  }

  return (
    <main>
      <PublicSection>
        <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0">
            <SectionHeader
              align="left"
              className="max-w-2xl"
              eyebrow="Contact"
              icon="headphones"
              text="Questions, feedback, and support requests stay connected to the existing admin message flow."
              title="Talk to us about your resume workflow"
            />
            <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Account help", "Report questions", "Product feedback"].map((item) => (
                <p className="flex items-center gap-2 text-sm font-black text-slate-700" key={item}>
                  <PublicIcon className="h-4 w-4 text-accent-700" name="checkCircle" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <HeroSupportPanel />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportItems.map((item, index) => (
            <SupportCard index={index + 1} key={item.title} {...item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="pt-0" tone="plain">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-start">
          <form className="public-card min-w-0 p-5 sm:p-6" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 border-b border-line pb-5">
              <IconBadge icon="send" tone="brand" />
              <div>
                <h2 className="text-xl font-black text-ink">Send us a message</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-muted">Fill the form and we will route it to the support inbox.</p>
              </div>
            </div>
            {(validationError || mutation.error) ? <div className="mt-4"><ErrorState message={validationError || mutation.error?.message || "Message failed"} /></div> : null}
            {mutation.isSuccess ? <div className="mt-4 rounded-card border border-emerald-200 bg-success-50 p-3 text-sm font-semibold text-success-700">{mutation.data}</div> : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ContactField icon="users" id="contact-name" label="Full Name" placeholder="Your full name" value={name} disabled={mutation.isPending} onChange={setName} />
              <ContactField icon="mail" id="contact-email" label="Email Address" placeholder="you@example.com" type="email" value={email} disabled={mutation.isPending} onChange={setEmail} />
              <div className="sm:col-span-2">
                <ContactField icon="messageCircle" id="contact-subject" label="Subject" placeholder="Support, complaint, feedback..." value={subject} disabled={mutation.isPending} onChange={setSubject} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="contact-message">
                  Message
                  <span className="contact-control mt-1.5 flex items-start gap-2 rounded-lg border border-line bg-white px-3 py-3 shadow-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-indigo-600/20">
                    <PublicIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" name="send" />
                    <textarea className="min-h-28 min-w-0 flex-1 resize-y bg-transparent text-sm text-ink outline-none placeholder:text-slate-400" disabled={mutation.isPending} id="contact-message" onChange={(event) => setMessage(event.target.value)} placeholder="Tell us how we can help you..." value={message} />
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button className="public-button bg-ink text-white shadow-sm hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={mutation.isPending} type="submit">
                {mutation.isPending ? "Sending..." : "Send Message"}
                <PublicIcon name="arrowRight" />
              </button>
              <p className="text-sm font-semibold text-muted">Your information stays in the support workflow.</p>
            </div>
          </form>

          <aside className="public-card min-w-0 p-5 sm:p-6">
            <SectionHeader align="left" eyebrow="Reach us" icon="mail" title="Choose the right support path" />
            <div className="mt-5 grid gap-3">
              {reachOptions.map((item) => (
                <ReachCard key={item.title} {...item} />
              ))}
            </div>
          </aside>
        </div>
      </PublicSection>

      <PublicSection>
        <SectionHeader eyebrow="Quick answers" icon="messageCircle" text="Short answers for the questions users usually ask before signing up." title="Frequently asked questions" />
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {faqs.map((faq) => (
            <FaqCard key={faq.title} {...faq} />
          ))}
        </div>
      </PublicSection>

      <CTASection
        primaryLabel="Explore Features"
        primaryTo="/features"
        secondaryLabel="How It Works"
        secondaryTo="/how-it-works"
        text="For product questions, the feature and process pages explain what happens before and after upload."
        title="Need context before contacting us?"
      />
    </main>
  );
}

function HeroSupportPanel() {
  return (
    <div className="relative min-w-0">
      <div className="overflow-hidden rounded-[1rem] border border-line bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
              <PublicIcon className="h-5 w-5" name="headphones" />
            </span>
            <div>
              <p className="text-sm font-black text-ink">Support inbox</p>
              <p className="text-xs font-semibold text-muted">Messages route to admin</p>
            </div>
          </div>
          <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-black text-success-700">Online</span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <MiniMetric icon="clock" label="Response" value="24h" />
          <MiniMetric icon="shield" label="Privacy" value="Protected" />
          <MiniMetric icon="messageCircle" label="Flow" value="Tracked" />
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <PublicIcon className="h-5 w-5" name="mail" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-ink">New support request</h3>
                  <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-black text-accent-700">Priority normal</span>
                </div>
                <p className="mt-2 text-sm font-medium leading-6 text-muted">Account help, resume report questions, and feedback stay organized in one message flow.</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {["Name", "Email", "Message"].map((item) => (
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-black text-slate-600" key={item}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: PublicIconName; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
      <PublicIcon className="h-4 w-4 text-brand-700" name={icon} />
      <p className="mt-3 text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function ContactField({ disabled, icon, id, label, onChange, placeholder, type = "text", value }: { disabled: boolean; icon: PublicIconName; id: string; label: string; onChange: (value: string) => void; placeholder: string; type?: string; value: string }) {
  return (
    <label className="label" htmlFor={id}>
      {label}
      <span className="contact-control mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-white px-3 shadow-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-indigo-600/20">
        <PublicIcon className="h-4 w-4 shrink-0 text-muted" name={icon} />
        <input className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400" disabled={disabled} id={id} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
      </span>
    </label>
  );
}

function SupportCard({ icon, index, text, title, tone }: { icon: PublicIconName; index: number; text: string; title: string; tone: "brand" | "accent" | "violet" }) {
  const toneClasses = {
    accent: "bg-accent-50 text-accent-700 ring-accent-100",
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  };

  return (
    <article className="public-card grid gap-4 p-4 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ring-1 ${toneClasses[tone]}`}>
        <PublicIcon className="h-5 w-5" name={icon} />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-black leading-snug text-ink">{title}</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-muted">{text}</p>
      </div>
      <span className="hidden h-8 w-8 place-items-center rounded-full border border-line bg-white text-xs font-black text-brand-700 shadow-sm sm:grid">
        0{index}
      </span>
    </article>
  );
}

function ReachCard({ helper, icon, text, title, tone }: { helper: string; icon: PublicIconName; text: string; title: string; tone: "brand" | "accent" | "violet" }) {
  const toneClasses = {
    accent: "bg-accent-50 text-accent-700 ring-accent-100",
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  };

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${toneClasses[tone]}`}>
          <PublicIcon className="h-5 w-5" name={icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-ink">{title}</h3>
          <p className="mt-1 break-words text-sm font-black text-slate-700">{text}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted">{helper}</p>
        </div>
      </div>
    </article>
  );
}

function FaqCard({ icon, text, title, tone }: { icon: PublicIconName; text: string; title: string; tone: "brand" | "accent" | "violet" | "amber" }) {
  const toneClasses = {
    accent: "bg-accent-50 text-accent-700 ring-accent-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  };

  return (
    <article className="public-card p-4">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${toneClasses[tone]}`}>
          <PublicIcon className="h-4 w-4" name={icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black leading-snug text-ink">{title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">{text}</p>
        </div>
      </div>
    </article>
  );
}
