import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

// ─── 6 Core Feature Capabilities ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h10l6 6v10H4V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    badgeClass: 'badge-blue',
    title: 'Resume Intelligence',
    desc: 'Extract and structure contact info, core competencies, employment history, and education directly from PDF resumes with zero manual data entry.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 13.5l4.5-4.5 4 4 5-6 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20.5" cy="11.5" r="1.5" fill="currentColor"/>
      </svg>
    ),
    badgeClass: 'badge-green',
    title: 'ATS Analysis',
    desc: 'Evaluate formatting stability, keyword frequency, and algorithmic applicant tracking readiness with comprehensive 0-100% scoring.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 10h18M8 15h3M14 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    badgeClass: 'badge-amber',
    title: 'Skill Gap Detection',
    desc: 'Isolate critical skills and tools demanded by the job posting that are missing from your resume before you submit an application.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8.5 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    badgeClass: 'badge-violet',
    title: 'Job Matching',
    desc: 'Run vector semantic comparisons between your candidate profile and the target job description to compute real relevance.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16a1 1 0 011 1v8a1 1 0 01-1 1H12l-4 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="8.5" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="15.5" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    badgeClass: 'badge-rose',
    title: 'AI Assistant',
    desc: 'Query your resume using retrieval-augmented generation (RAG) to receive concrete, evidence-backed improvements and coaching.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="3" width="10" height="11" rx="5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M12 20v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    badgeClass: 'badge-blue',
    title: 'Interview Preparation',
    desc: 'Generate role-tailored technical, behavioral, and resume-specific interview questions with STAR answer guidelines.',
  },
]

// ─── How it works steps ───────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload your resume',
    desc: 'Provide your existing resume in PDF format. Our parser extracts all qualifications, experiences, and technical keywords.',
  },
  {
    step: '02',
    title: 'Analyze a job',
    desc: 'Paste text or upload a PDF job description for any target role you want to pursue.',
  },
  {
    step: '03',
    title: 'Understand your match',
    desc: 'Inspect your calculated ATS score, discover missing keywords, and follow AI suggestions to optimize your application.',
  },
]

export default function Home() {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-accent-light selection:text-accent">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white"/>
                <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
                <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
                <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <span className="text-[16px] font-bold text-ink tracking-tight">ResumeIQ</span>
          </Link>

          {/* Nav links */}
          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-[13px] font-medium text-ink-secondary hover:text-ink transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-[13px] font-medium text-ink-secondary hover:text-ink transition-colors">
              How it works
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggle}
              className="btn-icon"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M14 10.5A6.5 6.5 0 015.5 2a6.5 6.5 0 100 12 6.5 6.5 0 008.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <Link to="/login" className="btn-secondary py-1.5 text-[13px]">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary py-1.5 text-[13px]">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-3.5 py-1 text-[11px] font-semibold text-accent dark:bg-accent/15">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"/>
            <span>AI-Powered Resume Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-[36px] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[48px] md:text-[54px]">
            Understand your resume.
            <br />
            <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
              Match better with the right jobs.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-secondary sm:text-[17px]">
            Upload your resume and compare it with job descriptions using ATS analysis, skill matching, and AI-powered recommendations.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-6 py-2.5 text-[14px]">
              Analyze My Resume
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-2.5 text-[14px]">
              Explore Dashboard
            </Link>
          </div>
        </div>

        {/* ── Realistic Product UI Preview ── */}
        <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-lg">
            {/* Mock window title bar */}
            <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-danger/80" />
                <div className="h-3 w-3 rounded-full bg-warning/80" />
                <div className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-2 text-[11px] font-mono text-ink-muted">resumeiq.ai/dashboard</span>
              </div>
              <span className="text-[11px] text-ink-muted font-medium">Production SaaS Workspace</span>
            </div>

            {/* Dashboard UI Simulation */}
            <div className="p-4 sm:p-6 bg-canvas space-y-4">
              {/* Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card p-4 rounded-xl">
                <div>
                  <h3 className="text-[16px] font-bold text-ink">Alex Carter 👋</h3>
                  <p className="text-[11px] text-ink-muted">Your resume intelligence workspace at a glance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-green">Target: Senior Full-Stack Engineer</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="card p-3.5">
                  <span className="label-uppercase">Resumes</span>
                  <p className="text-[20px] font-bold text-ink mt-0.5">2</p>
                  <p className="text-[10px] text-ink-muted">Uploaded PDFs</p>
                </div>
                <div className="card p-3.5">
                  <span className="label-uppercase">Target JDs</span>
                  <p className="text-[20px] font-bold text-ink mt-0.5">3</p>
                  <p className="text-[10px] text-ink-muted">Saved roles</p>
                </div>
                <div className="card p-3.5">
                  <span className="label-uppercase">ATS Compatibility</span>
                  <p className="text-[20px] font-bold text-success mt-0.5">84%</p>
                  <p className="text-[10px] text-ink-muted">Strong readiness</p>
                </div>
                <div className="card p-3.5">
                  <span className="label-uppercase">Semantic Match</span>
                  <p className="text-[20px] font-bold text-accent mt-0.5">78%</p>
                  <p className="text-[10px] text-ink-muted">Job fit score</p>
                </div>
              </div>

              {/* Preview Body Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {/* Left Mini Document */}
                <div className="card p-4 md:col-span-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-[12px] font-bold text-ink">Alex Carter — Staff Engineer</span>
                    <span className="badge-neutral text-[9px]">PDF Parsed</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-ink-secondary">
                    <p className="leading-relaxed">
                      Senior software engineer with 7+ years developing distributed backend services, high-throughput microservices, and React design systems.
                    </p>
                    <div>
                      <span className="text-[10px] font-bold text-ink uppercase tracking-wider block mb-1">
                        Extracted Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['React', 'TypeScript', 'Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'TailwindCSS'].map((s) => (
                          <span key={s} className="skill-tag bg-surface border-border text-ink text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Mini Score & Gaps */}
                <div className="card p-4 md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-[12px] font-bold text-ink">Match Breakdown</span>
                    <span className="badge-blue text-[9px]">ATS Check</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold text-success block mb-1">✓ Matched Requirements</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="skill-tag-match text-[10px]">React & TypeScript</span>
                        <span className="skill-tag-match text-[10px]">FastAPI Backend</span>
                        <span className="skill-tag-match text-[10px]">PostgreSQL</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] font-semibold text-danger block mb-1">✕ Missing Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="skill-tag-missing text-[10px]">Kubernetes</span>
                        <span className="skill-tag-missing text-[10px]">AWS ECS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="border-t border-border py-20 bg-surface/20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="label-uppercase mb-2">Workflow</p>
            <h2 className="text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
              How it works
            </h2>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Three streamlined steps from file upload to actionable hiring insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="card p-6 flex flex-col justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-light text-accent text-[12px] font-bold dark:bg-accent/15 mb-4">
                    {step}
                  </span>
                  <h3 className="text-[15px] font-bold text-ink mb-2">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-ink-secondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="border-t border-border py-20 bg-canvas">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="label-uppercase mb-2">Platform Capabilities</p>
            <h2 className="text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
              Purpose-built tools for modern job seekers
            </h2>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Everything required to benchmark, align, and refine your resume.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, badgeClass, title, desc }) => (
              <div
                key={title}
                className="card p-6 transition-all duration-200 hover:border-accent/40 hover:shadow-card-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                  {icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-[14px] font-bold text-ink">{title}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-border py-16 bg-surface/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-[28px] font-bold text-ink sm:text-[34px]">
            Ready to benchmark your resume?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14px] text-ink-secondary">
            Upload your resume, compare against any role, and start applying with confidence.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-2.5 text-[14px]">
              Get started free
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-2.5 text-[14px]">
              Sign in to workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet text-white">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white"/>
                <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
                <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
                <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <span className="text-[13px] font-bold text-ink">ResumeIQ</span>
          </div>

          <p className="text-[12px] text-ink-muted">
            Production AI Resume & Job Intelligence Platform.
          </p>

          <div className="flex items-center gap-4 text-[12px] text-ink-secondary">
            <Link to="/login" className="hover:text-ink">Sign in</Link>
            <Link to="/register" className="hover:text-ink">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
