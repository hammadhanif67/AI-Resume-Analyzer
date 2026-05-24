import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen overflow-x-hidden bg-[#f8fbff] lg:grid-cols-[52fr_48fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#071327] px-8 py-7 text-white lg:flex lg:items-center xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_88%,rgba(124,58,237,0.34),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(59,130,246,0.2),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[39rem]">
          <div className="flex items-center gap-3 text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-indigo-400/45 bg-indigo-500/10 text-indigo-200 shadow-[0_0_24px_rgba(99,102,241,0.35)]">
              <DocumentIcon />
            </span>
            FYP Resume Intelligence
          </div>
          <div className="mt-7 inline-flex rounded-full border border-indigo-400/45 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-indigo-100 shadow-[0_0_32px_rgba(99,102,241,0.16)]">
            Smart. Insightful. Impactful.
          </div>
          <h1 className="mt-5 max-w-[36rem] text-[clamp(42px,4.2vw,68px)] font-black leading-[0.98] tracking-normal text-white">
            Premium resume analysis for serious{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-violet-400 bg-clip-text text-transparent">
              career decisions.
            </span>
          </h1>
          <p className="mt-4 max-w-[31rem] text-[17px] leading-7 text-slate-200">
            Upload, score, compare, and download reports through the existing authenticated workflow.
          </p>
          <div className="mt-8 max-w-[460px] rounded-[1.1rem] border border-indigo-300/30 bg-white/[0.08] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_18px_44px_rgba(99,102,241,0.32)]">
              <ChartIcon />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-white">ATS Score Preview</p>
              <p className="mt-1.5 text-[34px] font-black tracking-normal text-white">
                92<span className="text-xl font-semibold text-slate-400">/100</span>
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-[13px] leading-6 text-slate-200">
            Structured sections, strong keywords, and report-ready recommendations.
          </p>
          </div>
        </div>
      </section>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-5 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(126deg,rgba(99,102,241,0.13)_0%,rgba(255,255,255,0)_35%,rgba(59,130,246,0.1)_100%)]" />
        <div className="relative w-full max-w-[520px] rounded-[1.35rem] border border-white/80 bg-white/90 p-7 shadow-[0_24px_72px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-9 lg:px-10 lg:py-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-blue-600">
              <SparkIcon />
            </span>
            <h1 className="text-[25px] font-extrabold leading-tight tracking-normal text-ink">AI Resume Analyzer</h1>
          </div>
          <p className="mt-3 text-[15px] leading-6 text-slate-600">Sign in to continue your resume analysis workflow.</p>
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 3v5h5M9 13h6M9 17h4M9 9h2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
      <path d="M5 19V9M10 19V5M15 19v-7M20 19V8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4 19h17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 3c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}
