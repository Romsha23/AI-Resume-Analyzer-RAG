import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI, resumeAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ea = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : [])

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

// Rotating skill pill colors
const PILL_PALETTE = [
  'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
  'bg-[#FDF2F8] text-[#BE185D] border-[#FBCFE8]',
  'bg-[#FFF7ED] text-[#B45309] border-[#FDE68A]',
  'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
]
const pillColor = (i) => PILL_PALETTE[i % PILL_PALETTE.length]

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, bgClass, iconClass }) {
  return (
    <div className="card p-5 flex items-start justify-between gap-3 hover:-translate-y-0.5 transition-transform">
      <div className="min-w-0">
        <p className="label-uppercase mb-2">{label}</p>
        <p className="text-[28px] font-bold text-ink tabular-nums leading-none">{value ?? '—'}</p>
        {sub && <p className="mt-1.5 truncate text-[11px] text-ink-muted">{sub}</p>}
      </div>
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${bgClass}`}>
        <span className={iconClass}>{icon}</span>
      </div>
    </div>
  )
}

// ─── ATS Score Ring ─────────────────────────────────────────────────────────────
function AtsRing({ score, size = 140 }) {
  const sw = 10
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(score, 100) / 100) * c
  const id = 'ats-grad'

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2563EB"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={`url(#${id})`} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[30px] font-bold text-ink tabular-nums leading-none">
          {Math.round(score)}
        </span>
        <span className="text-[11px] font-medium text-ink-muted">/100</span>
      </div>
    </div>
  )
}

// ─── Health Bar ────────────────────────────────────────────────────────────────
function HealthBar({ label, pct, barClass, bgLight }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(Math.min(pct || 0, 100)), 200); return () => clearTimeout(t) }, [pct])
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${barClass}`} />
          <span className="text-[12px] font-medium text-ink-secondary">{label}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${bgLight}`}>
          {Math.round(pct || 0)}%
        </span>
      </div>
      <div className="progress-track">
        <div className={`${barClass} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${w}%` }} />
      </div>
    </div>
  )
}

// ─── Resume document preview ────────────────────────────────────────────────────
function ResumeDocCard({ resume, loading }) {
  const pd = resume?.parsed_data

  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-light">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 1H9.5L12.5 4.5V13H3.5V1Z" stroke="#2563EB" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M9.5 1V4.5H12.5" stroke="#2563EB" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </span>
          <h2 className="text-[14px] font-semibold text-ink">Resume Preview</h2>
        </div>
        <Link to="/resume" className="text-[11px] font-medium text-accent hover:underline">
          View full →
        </Link>
      </div>

      {/* Document area — dark-aware surface bg */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface/40" style={{ minHeight: '300px' }}>
        {loading ? (
          <div className="mx-auto max-w-sm space-y-3 rounded-2xl bg-card p-7 shadow-card">
            {[85,60,90,65,75,50,80].map((w,i) => (
              <div key={i} className="h-2.5 animate-pulse rounded bg-border" style={{ width: `${w}%` }}/>
            ))}
          </div>
        ) : !resume ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 3H14L19 8V20H5V3Z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M14 3V8H19" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-ink">No resume uploaded</p>
            <p className="mt-1 text-[12px] text-ink-muted">Upload your resume PDF to get started</p>
            <Link to="/resume" className="btn-primary mt-5">Upload Resume</Link>
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-2xl bg-card px-7 py-6 shadow-card-md">
            {/* Name / contact */}
            <div className="border-b border-border pb-4 text-center">
              {pd?.name && <h3 className="text-[18px] font-bold text-ink">{pd.name}</h3>}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {pd?.email    && <span className="text-[10px] text-ink-secondary">{pd.email}</span>}
                {pd?.phone    && <><span className="text-border">·</span><span className="text-[10px] text-ink-secondary">{pd.phone}</span></>}
                {pd?.location && <><span className="text-border">·</span><span className="text-[10px] text-ink-secondary">{pd.location}</span></>}
              </div>
            </div>
            {/* Summary */}
            {pd?.summary && (
              <div className="border-b border-border py-3">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-ink-muted">Summary</p>
                <p className="text-[10px] leading-relaxed text-ink-secondary line-clamp-3">{pd.summary}</p>
              </div>
            )}
            {/* Skills grid */}
            {ea(pd?.skills).length > 0 && (
              <div className="border-b border-border py-3">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-widest text-ink-muted">Skills</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                  {ea(pd.skills).slice(0, 10).map((s, i) => (
                    <span key={i} className="text-[10px] text-ink-secondary">· {typeof s === 'string' ? s : ''}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Experience */}
            {ea(pd?.experience).length > 0 && (
              <div className="pt-3">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-widest text-ink-muted">Experience</p>
                <div className="space-y-2">
                  {ea(pd.experience).slice(0, 3).map((exp, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-ink truncate">{exp.company || exp.organization || '—'}</p>
                        <p className="text-[9px] text-ink-secondary">{exp.role || exp.title || exp.position || ''}</p>
                      </div>
                      <span className="ml-2 flex-shrink-0 text-[9px] text-ink-muted">{exp.duration || exp.dates || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* File card */}
      {resume && (
        <div className="border-t border-border px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-light">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 1H10L13.5 4.5V15H3.5V1Z" stroke="#2563EB" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M10 1V4.5H13.5" stroke="#2563EB" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-ink">{resume.filename}</p>
                <p className="text-[10px] text-ink-muted">
                  {new Date(resume.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </p>
              </div>
            </div>
            <Link to="/resume" className="btn-ghost flex-shrink-0 text-[12px] gap-1">
              Open
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ATS + Career Health Card ───────────────────────────────────────────────────
function CareerCard({ stats, resume }) {
  const pd = resume?.parsed_data
  const atsScore   = stats?.latest_ats_score ? Math.round(stats.latest_ats_score) : 0
  const skills     = ea(pd?.skills)
  const skillCov   = Math.min(skills.length * 5, 100)
  const profComp   = [pd?.name, pd?.email, pd?.phone, pd?.location, pd?.summary].filter(Boolean).length * 20

  return (
    <div className="card p-5 flex flex-col gap-5">
      {/* ATS Ring */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-ink">ATS Score</h2>
          <span className={`badge ${atsScore >= 80 ? 'badge-green' : atsScore >= 60 ? 'badge-blue' : 'badge-neutral'}`}>
            {atsScore >= 80 ? 'Strong' : atsScore >= 60 ? 'Good' : 'Needs Work'}
          </span>
        </div>
        {atsScore > 0 ? (
          <div className="flex items-center gap-5">
            <AtsRing score={atsScore} size={110} />
            <div className="space-y-2">
              <p className="text-[11px] text-ink-muted">ATS Readiness Score</p>
              <p className="text-[12px] text-ink-secondary">
                {atsScore >= 80 ? 'Your resume performs strongly against ATS systems.'
                  : atsScore >= 60 ? 'Resume has good ATS compatibility with room to improve.'
                  : 'Consider improving keywords and formatting.'}
              </p>
              <Link to="/ats" className="inline-flex text-[11px] font-semibold text-accent hover:underline">
                View full analysis →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-[110px] w-[110px] flex-shrink-0 items-center justify-center rounded-full border-[10px] border-border">
              <span className="text-[13px] font-bold text-ink-muted">N/A</span>
            </div>
            <div>
              <p className="text-[12px] text-ink-secondary">No ATS analysis run yet.</p>
              <Link to="/ats" className="mt-2 inline-flex text-[12px] font-semibold text-accent hover:underline">
                Run Analysis →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Career Health */}
      <div>
        <h2 className="mb-3 text-[14px] font-semibold text-ink">Career Health</h2>
        <div className="space-y-3">
          <HealthBar label="ATS Readiness"        pct={atsScore}  barClass="bg-accent"  bgLight="bg-accent-light text-accent"/>
          <HealthBar label="Skill Coverage"        pct={skillCov}  barClass="bg-violet"  bgLight="bg-violet-light text-violet"/>
          <HealthBar label="Profile Completeness"  pct={profComp}  barClass="bg-success" bgLight="bg-success-light text-success"/>
        </div>
      </div>
    </div>
  )
}

// ─── CV Parsing Card ────────────────────────────────────────────────────────────
function CVParsingCard({ resume }) {
  const pd = resume?.parsed_data

  const FIELD_COLORS = [
    { key: 'NAME',     val: pd?.name,     dot: 'bg-accent',   label: 'text-accent' },
    { key: 'EMAIL',    val: pd?.email,    dot: 'bg-violet',   label: 'text-violet' },
    { key: 'PHONE',    val: pd?.phone,    dot: 'bg-rose',     label: 'text-rose'   },
    { key: 'LOCATION', val: pd?.location, dot: 'bg-amber',    label: 'text-amber'  },
    { key: 'SUMMARY',  val: pd?.summary,  dot: 'bg-success',  label: 'text-success'},
  ]

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-[14px] font-semibold text-ink">CV Parsing Result</h2>
        <Link to="/resume" className="text-[11px] font-medium text-accent hover:underline">View all →</Link>
      </div>

      {!resume ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <p className="text-[12px] text-ink-muted">Upload a resume to see parsed profile</p>
          <Link to="/resume" className="btn-primary mt-4">Upload Resume</Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {FIELD_COLORS.filter(f => f.val).map(({ key, val, dot, label }) => (
            <div key={key} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-canvas">
              <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot}`} />
              <span className={`w-[68px] flex-shrink-0 text-[9px] font-bold uppercase tracking-wide ${label}`}>
                {key}
              </span>
              <span className={`min-w-0 text-[12px] text-ink ${key === 'SUMMARY' ? 'line-clamp-2 leading-relaxed' : 'truncate'}`}>
                {val}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Skills Card ────────────────────────────────────────────────────────────────
function SkillsCard({ resume, stats }) {
  const pd     = resume?.parsed_data
  const skills = ea(pd?.skills).filter(s => typeof s === 'string')
  const topSkills = ea(stats?.top_skills)

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink">Skills Analytics</h2>
        {skills.length > 0 && (
          <span className="badge-blue">{skills.length} found</span>
        )}
      </div>

      {skills.length === 0 && topSkills.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-[12px] text-ink-muted">Upload a resume to extract skills</p>
        </div>
      ) : (
        <>
          {/* Parsed skills from resume */}
          {skills.length > 0 && (
            <div>
              <p className="label-uppercase mb-2">Parsed from resume</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 18).map((s, i) => (
                  <span key={i} className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${pillColor(i)}`}>
                    {s}
                  </span>
                ))}
                {skills.length > 18 && (
                  <span className="inline-flex items-center rounded-full border border-border bg-canvas px-2.5 py-0.5 text-[11px] text-ink-muted">
                    +{skills.length - 18} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Top skills from analysis */}
          {topSkills.length > 0 && (
            <div>
              <p className="label-uppercase mb-2 text-success">Strong Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {topSkills.slice(0, 8).map((s, i) => (
                  <span key={i} className="skill-tag-match">{s}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Trending / Insights Card ───────────────────────────────────────────────────
function InsightsCard({ stats }) {
  const suggestions = ea(stats?.recent_suggestions)
  const missing     = ea(stats?.missing_skills)

  if (!suggestions.length && !missing.length) return null

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="white">
            <path d="M5 1l1 2.5H8.5L6 5.5l1 3L5 7l-2 1.5 1-3L1.5 3.5H4L5 1Z"/>
          </svg>
        </span>
        <h2 className="text-[14px] font-semibold text-ink">AI Career Insights</h2>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {suggestions.slice(0, 4).map((s, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-canvas">
            <span className="mt-px flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-accent-light text-[9px] font-bold text-accent">
              {i + 1}
            </span>
            <p className="text-[12px] leading-relaxed text-ink-secondary">{s}</p>
          </div>
        ))}
        {missing.length > 0 && (
          <div className="px-5 py-3">
            <p className="label-uppercase mb-2 text-rose">Skill Gaps</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.slice(0, 6).map((s, i) => (
                <span key={i} className="skill-tag-missing">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Skill Analysis Card ────────────────────────────────────────────────────────
function SkillAnalysisCard({ stats }) {
  const matched = ea(stats?.top_skills)
  const missing = ea(stats?.missing_skills)
  if (!matched.length && !missing.length) return null

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-ink">Skill Analysis</h2>
        <Link to="/ats" className="btn-secondary gap-1.5 py-1.5 text-[12px]">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 8.5L4 5.5l2 2 2.5-4 2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Run ATS Analysis
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {matched.length > 0 && (
          <div>
            <p className="label-uppercase mb-2 text-success">Matched Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {matched.map((s, i) => <span key={i} className="skill-tag-match">{s}</span>)}
            </div>
          </div>
        )}
        {missing.length > 0 && (
          <div>
            <p className="label-uppercase mb-2 text-danger">Skill Gaps</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.map((s, i) => <span key={i} className="skill-tag-missing">{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Feature Quick-Nav Card ─────────────────────────────────────────────────────
function FeatureCard({ to, label, desc, icon, bgClass, iconClass, borderClass }) {
  return (
    <Link
      to={to}
      className={`card group flex flex-col gap-3 p-5 transition-all hover:-translate-y-1 hover:shadow-card-md ${borderClass}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bgClass}`}>
        <span className={iconClass}>{icon}</span>
      </div>
      <div>
        <p className="text-[13px] font-semibold text-ink group-hover:text-accent transition-colors">{label}</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">{desc}</p>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
        Open
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { dark, toggle } = useTheme()

  useEffect(() => {
    Promise.all([
      dashboardAPI.stats().then(r => setStats(r.data)).catch(() => {}),
      resumeAPI.list().then(r => setResumes(r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const displayName   = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const latestResume  = resumes[0] || null
  const atsScore      = stats?.latest_ats_score ? Math.round(stats.latest_ats_score) : null
  const isEmpty       = !loading && !stats?.total_resumes && !stats?.total_jds

  const STAT_CARDS = [
    {
      label: 'Resumes',
      value: loading ? '—' : stats?.total_resumes ?? 0,
      sub:   latestResume ? latestResume.filename.slice(0, 22) : 'None uploaded',
      icon:  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 2H12L16 6V16H4V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6.5 9.5h6M6.5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      bgClass: 'bg-accent-light', iconClass: 'text-accent',
    },
    {
      label: 'Job Descriptions',
      value: loading ? '—' : stats?.total_jds ?? 0,
      sub:   'Saved JD files',
      icon:  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3H4a1 1 0 00-1 1v11a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1H12" stroke="currentColor" strokeWidth="1.4"/><rect x="6" y="2" width="6" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M6.5 8h5M6.5 10.5h5M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      bgClass: 'bg-violet-light', iconClass: 'text-violet',
    },
    {
      label: 'Analyses Run',
      value: loading ? '—' : stats?.total_analyses ?? 0,
      sub:   'Total analyses completed',
      icon:  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13l4-5.5 3 3 4-6 3.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      bgClass: 'bg-rose-light', iconClass: 'text-rose',
    },
    {
      label: 'ATS Score',
      value: loading ? '—' : atsScore !== null ? `${atsScore}` : 'N/A',
      sub:   atsScore !== null ? (atsScore >= 80 ? 'Strong performance' : atsScore >= 60 ? 'Moderate' : 'Needs improvement') : 'Run analysis first',
      icon:  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M9 5.5v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      bgClass: 'bg-amber-light', iconClass: 'text-amber',
    },
  ]

  return (
    <div className="animate-fade-in min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-[20px] font-bold text-ink">
            {displayName} 👋
          </h1>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Your resume intelligence dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button onClick={toggle} className="btn-icon" title={dark ? 'Light mode' : 'Dark mode'}>
            {dark
              ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 10.5A6.5 6.5 0 015.5 2a6.5 6.5 0 100 12 6.5 6.5 0 008.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            }
          </button>
          <Link to="/resume" className="btn-secondary gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M4 1.5H10L13 5V12.5H4V1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M10 1.5V5H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            Resume
          </Link>
          <Link to="/jd" className="btn-primary gap-1.5">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Analyze Job
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Empty state ── */}
        {isEmpty && (
          <div className="card p-8 text-center bg-surface/30">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet shadow-card-md">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-ink">Get started with ResumeIQ</h3>
            <p className="mt-1.5 text-[13px] text-ink-secondary">
              Upload your resume and a job description to begin your AI-powered analysis.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/resume" className="btn-secondary">Upload Resume</Link>
              <Link to="/jd" className="btn-primary">Add Job Description</Link>
            </div>
          </div>
        )}

        {/* ── Row 1: Resume preview (large) + Career health ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ResumeDocCard resume={latestResume} loading={loading} />
          </div>
          <div className="xl:col-span-2">
            <CareerCard stats={stats} resume={latestResume} />
          </div>
        </div>

        {/* ── Row 2: CV Parsing + Skills ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <CVParsingCard resume={latestResume} />
          <SkillsCard resume={latestResume} stats={stats} />
        </div>

        {/* ── Row 3: Skill Analysis + AI Insights ── */}
        {!loading && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SkillAnalysisCard stats={stats} />
            </div>
            <div className="lg:col-span-1">
              <InsightsCard stats={stats} />
            </div>
          </div>
        )}

        {/* ── Feature cards ── */}
        {!isEmpty && !loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FeatureCard
              to="/ats" label="ATS Analysis" desc="Check ATS compatibility"
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 13l4-5.5 3 3 4-5.5 3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              bgClass="bg-accent-light" iconClass="text-accent" borderClass="hover:border-accent/30"
            />
            <FeatureCard
              to="/match" label="Match Report" desc="Resume vs job fit"
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9l2.5 2.5L13 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              bgClass="bg-violet-light" iconClass="text-violet" borderClass="hover:border-violet/30"
            />
            <FeatureCard
              to="/chat" label="AI Assistant" desc="Ask about your resume"
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4.5h12a1 1 0 011 1v6a1 1 0 01-1 1H9.5L7.5 14V12.5H5a1 1 0 01-1-1v-6a1 1 0 011-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>}
              bgClass="bg-rose-light" iconClass="text-rose" borderClass="hover:border-rose/30"
            />
            <FeatureCard
              to="/interview" label="Interview Prep" desc="Practice questions"
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="6" y="2" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M3.5 10c0 3 2.5 5 5.5 5s5.5-2 5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M9 15v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
              bgClass="bg-amber-light" iconClass="text-amber" borderClass="hover:border-amber/30"
            />
          </div>
        )}

      </div>
    </div>
  )
}
