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

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function MatchGauge({ score = 0, size = 120 }) {
  const strokeWidth = 8
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const clampedScore = Math.min(Math.max(Math.round(score), 0), 100)
  const offset = circ - (clampedScore / 100) * circ
  const color = clampedScore >= 75 ? '#16A34A' : clampedScore >= 50 ? '#F59E0B' : '#EF4444'

  return (
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
        <span className="text-[24px] font-bold text-ink tabular-nums leading-none">
          {clampedScore}%
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-ink-muted mt-1">
          Match
        </span>
      </div>
    </div>
  )
}

export default function MatchReport() {
  const { resumes, jds, resumeId, setResumeId, jdId, setJdId, loading } = useSelection()
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const runMatch = async () => {
    if (!resumeId || !jdId) return
    setAnalyzing(true)
    setError('')
    try {
      const { data } = await analyzeAPI.match({
        resume_id: parseInt(resumeId),
        jd_id: parseInt(jdId),
      })
      setResult(data)
    } catch (e) {
      console.error('Match analysis failed:', e)
      setError('Matching failed. Please verify that the selected resume and JD are valid.')
    } finally {
      setAnalyzing(false)
    }
  }

  const selectedResume = resumes.find((r) => String(r.id) === String(resumeId))
  const selectedJd = jds.find((j) => String(j.id) === String(jdId))

  const matchingSkills = ensureArray(result?.matching_skills)
  const missingTech = ensureArray(result?.missing_technologies)
  const recommendations = ensureArray(result?.recommended_improvements)

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-48 skeleton" />
        <div className="h-28 skeleton" />
        <div className="h-64 skeleton" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="Resume vs Job Match Report"
        description="Comprehensive vector semantic comparison between candidate credentials and job criteria"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/chat" className="btn-secondary text-[12px] py-1.5 gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 3.5h9v6H8.5L6 12V9.5H3.5v-6Z" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Ask AI Assistant
            </Link>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-6xl mx-auto w-full">
        {/* ── Selection Control Bar ── */}
        <div className="card p-5">
          <p className="label-uppercase mb-3">Select Comparison Documents</p>
          <div className="flex flex-wrap items-end gap-3.5">
            <div className="w-full sm:w-64">
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Candidate Resume <span className="text-danger">*</span>
              </label>
              <select
                className="input-field"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              >
                {resumes.length === 0 && <option value="">No resumes found</option>}
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.filename}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64">
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Target Job Description <span className="text-danger">*</span>
              </label>
              <select
                className="input-field"
                value={jdId}
                onChange={(e) => setJdId(e.target.value)}
              >
                {jds.length === 0 && <option value="">No JDs found</option>}
                {jds.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={runMatch}
              disabled={!resumeId || !jdId || analyzing}
              className="btn-primary min-w-[130px] justify-center"
            >
              {analyzing ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Comparing...
                </>
              ) : (
                'Compare Fit'
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

        {/* ── Loading State ── */}
        {analyzing ? (
          <div className="card p-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent dark:bg-accent/15">
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-ink">Evaluating Document Alignment...</h3>
              <p className="mt-1 text-[13px] text-ink-secondary">
                Running semantic similarity, keyword matching, and requirements cross-referencing.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* ── Comparison Banner: Resume VS Job ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="card p-4 border-l-4 border-accent">
                <span className="label-uppercase">Selected Candidate Resume</span>
                <p className="mt-1 text-[14px] font-bold text-ink truncate">
                  {selectedResume?.filename || 'Resume'}
                </p>
                <p className="text-[11px] text-ink-muted">ID #{resumeId}</p>
              </div>

              <div className="card p-4 border-l-4 border-violet">
                <span className="label-uppercase">Target Job Opportunity</span>
                <p className="mt-1 text-[14px] font-bold text-ink truncate">
                  {selectedJd?.title || 'Job Description'}
                </p>
                <p className="text-[11px] text-ink-muted">ID #{jdId}</p>
              </div>
            </div>

            {/* ── Score and Executive Summary Card ── */}
            <div className="card p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <MatchGauge score={result.match_percentage} size={130} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[14px] font-bold text-ink">Alignment Summary</span>
                    <span
                      className={`badge ${
                        result.match_percentage >= 75
                          ? 'badge-green'
                          : result.match_percentage >= 50
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                    >
                      {result.match_percentage >= 75
                        ? 'High Fit'
                        : result.match_percentage >= 50
                        ? 'Moderate Fit'
                        : 'Low Match'}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink-secondary">
                    {result.summary || 'Comparison completed successfully.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Skills Comparison: Matching vs Missing ── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Matching Skills */}
              <div className="card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-light text-success text-[10px] font-bold dark:bg-success/20">
                      ✓
                    </span>
                    <span className="text-[13px] font-bold text-ink">Matching Skills & Requirements</span>
                  </div>
                  <span className="badge-green text-[10px]">{matchingSkills.length}</span>
                </div>

                {matchingSkills.length === 0 ? (
                  <p className="text-[12px] text-ink-muted italic">No direct matching skills identified.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchingSkills.map((s, i) => (
                      <span key={i} className="skill-tag-match">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Technologies */}
              <div className="card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-light text-danger text-[10px] font-bold dark:bg-danger/20">
                      ✕
                    </span>
                    <span className="text-[13px] font-bold text-ink">Missing Technologies & Gaps</span>
                  </div>
                  <span className="badge-red text-[10px]">{missingTech.length}</span>
                </div>

                {missingTech.length === 0 ? (
                  <p className="text-[12px] text-ink-muted italic">No skill gaps detected for this role.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {missingTech.map((t, i) => (
                      <span key={i} className="skill-tag-missing">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Recommended Improvements ── */}
            {recommendations.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <span className="label-uppercase">Recommended Resume Improvements</span>
                  <span className="badge-blue text-[10px]">{recommendations.length} items</span>
                </div>
                <div className="space-y-2.5">
                  {recommendations.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface/30 p-3 hover:bg-surface transition-colors"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-[13px] leading-relaxed text-ink-secondary">{item}</p>
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
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5.5 8l2 2L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-ink">Ready to compare</h3>
            <p className="mt-1 max-w-sm mx-auto text-[12px] text-ink-muted">
              Pick a resume and a job description above, then click &quot;Compare Fit&quot; to see match percentage and skill gap intelligence.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
