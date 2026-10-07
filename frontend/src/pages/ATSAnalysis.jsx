import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelection } from '../hooks/useSelection'
import { analyzeAPI } from '../services/api'
import PageHeader from '../components/PageHeader'

// ─── Defensive array helper ───────────────────────────────────────────────────
function ensureArray(val) {
  if (Array.isArray(val)) return val
  if (!val) return []
  if (typeof val === 'object') return Object.values(val)
  if (typeof val === 'string') {
    return val.includes(',')
      ? val.split(',').map((s) => s.trim()).filter(Boolean)
      : [val.trim()]
  }
  return []
}

// ─── Perfect non-overflowing Circular Score Indicator ─────────────────────────
function ScoreRing({ score = 0, size = 130 }) {
  const strokeWidth = 8
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const clampedScore = Math.min(Math.max(Math.round(score), 0), 100)
  const offset = circ - (clampedScore / 100) * circ
  const color = clampedScore >= 80 ? '#16A34A' : clampedScore >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', display: 'block' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[26px] font-bold text-ink tabular-nums leading-none">
            {clampedScore}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mt-1">
            ATS Score
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Progress Bar Metric ──────────────────────────────────────────────────────
function MetricItem({ label, value = 0 }) {
  const pct = Math.min(Math.max(Math.round(value || 0), 0), 100)
  const colorClass =
    pct >= 80 ? 'bg-success' : pct >= 60 ? 'bg-warning' : 'bg-danger'
  const textClass =
    pct >= 80 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-danger'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2 text-[12px]">
        <span className="font-medium text-ink-secondary truncate">{label}</span>
        <span className={`font-semibold tabular-nums ${textClass}`}>{pct}%</span>
      </div>
      <div className="progress-track">
        <div
          className={`h-1.5 rounded-full ${colorClass} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ATSAnalysis() {
  const { resumes, jds, resumeId, setResumeId, jdId, setJdId, loading } = useSelection()
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const runAnalysis = async () => {
    if (!resumeId) return
    setAnalyzing(true)
    setError('')
    try {
      const { data } = await analyzeAPI.atsScore({
        resume_id: parseInt(resumeId),
        jd_id: jdId ? parseInt(jdId) : null,
      })
      setResult(data)
    } catch (e) {
      console.error('ATS analysis error:', e)
      setError('Analysis failed. Please ensure the backend is running and retry.')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-48 skeleton" />
        <div className="h-28 skeleton" />
        <div className="h-64 skeleton" />
      </div>
    )
  }

  const strengths = ensureArray(result?.strengths)
  const weaknesses = ensureArray(result?.weaknesses)
  const missingSkills = ensureArray(result?.missing_skills)
  const recommendations = ensureArray(result?.recommendations)

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="ATS Compatibility Analysis"
        description="Verify keyword penetration, formatting reliability, and algorithmic applicant tracking readiness"
        actions={
          result && (
            <Link to="/match" className="btn-secondary text-[12px] py-1.5 gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5.5 8l2 2L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              View Match Report
            </Link>
          )
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-6xl mx-auto w-full">
        {/* ── Configuration Panel ── */}
        <div className="card p-5">
          <p className="label-uppercase mb-3">Analysis Configuration</p>
          <div className="flex flex-wrap items-end gap-3.5">
            <div className="w-full sm:w-64">
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Select Resume <span className="text-danger">*</span>
              </label>
              <select
                className="input-field"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              >
                {resumes.length === 0 && <option value="">No resumes available</option>}
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64">
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Target Job Description <span className="text-ink-muted">(Optional)</span>
              </label>
              <select
                className="input-field"
                value={jdId}
                onChange={(e) => setJdId(e.target.value)}
              >
                <option value="">General ATS Benchmark</option>
                {jds.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={runAnalysis}
              disabled={!resumeId || analyzing}
              className="btn-primary min-w-[130px] justify-center"
            >
              {analyzing ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Calculating...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger-muted bg-danger-light p-3 text-[12px] text-danger dark:bg-danger/15">
              <span className="font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── Results View ── */}
        {analyzing ? (
          <div className="card p-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent dark:bg-accent/15">
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-ink">Analyzing Resume Structure...</h3>
              <p className="mt-1 text-[13px] text-ink-secondary">
                Checking keyword density, formatting compliance, skills match, and parsing heuristics.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* Main Score + Breakdown Card */}
            <div className="card p-6">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
                <div className="flex-shrink-0">
                  <ScoreRing score={result.ats_score} size={140} />
                </div>

                <div className="w-full min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MetricItem label="Skills Match" value={result.skills_match} />
                  <MetricItem label="Keywords Match" value={result.keywords_match} />
                  <MetricItem label="Experience Alignment" value={result.experience_match} />
                  <MetricItem label="Education Match" value={result.education_match} />
                  <MetricItem label="Formatting Integrity" value={result.formatting_score} />
                  <MetricItem label="Project Relevance" value={result.project_relevance} />
                </div>
              </div>
            </div>

            {/* Strengths, Weaknesses & Missing Skills 3-column Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Strengths */}
              <div className="card p-5">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-light text-success text-[10px] font-bold dark:bg-success/20">
                    ✓
                  </span>
                  <span className="text-[13px] font-bold text-ink">Verified Strengths</span>
                </div>
                {strengths.length === 0 ? (
                  <p className="text-[12px] text-ink-muted italic">No specific strengths highlighted.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-ink-secondary leading-relaxed">
                        <span className="text-success font-bold mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Weaknesses */}
              <div className="card p-5">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-light text-danger text-[10px] font-bold dark:bg-danger/20">
                    ✕
                  </span>
                  <span className="text-[13px] font-bold text-ink">ATS Bottlenecks</span>
                </div>
                {weaknesses.length === 0 ? (
                  <p className="text-[12px] text-ink-muted italic">No critical bottlenecks found.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-ink-secondary leading-relaxed">
                        <span className="text-danger font-bold mt-0.5">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Missing Skills */}
              <div className="card p-5">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-light text-amber text-[10px] font-bold dark:bg-amber/20">
                    !
                  </span>
                  <span className="text-[13px] font-bold text-ink">Missing Skills</span>
                </div>
                {missingSkills.length === 0 ? (
                  <p className="text-[12px] text-ink-muted italic">All required skills identified.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {missingSkills.map((m, i) => (
                      <span key={i} className="skill-tag-missing">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <span className="label-uppercase">Actionable AI Recommendations</span>
                  <span className="badge-blue text-[10px]">{recommendations.length} action items</span>
                </div>
                <div className="space-y-2.5">
                  {recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface/30 p-3 hover:bg-surface transition-colors"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-[13px] leading-relaxed text-ink-secondary">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink-muted">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M2 11L5 7 7.5 9.5 10.5 5.5 14 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="9" r="1.2" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-ink">No analysis generated yet</h3>
            <p className="mt-1 max-w-sm mx-auto text-[12px] text-ink-muted">
              Select your uploaded resume above and click &quot;Run Analysis&quot; to receive a comprehensive ATS evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
