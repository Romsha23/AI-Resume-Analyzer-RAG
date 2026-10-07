import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelection } from '../hooks/useSelection'
import { generateAPI } from '../services/api'
import PageHeader from '../components/PageHeader'

// ─── Defensive array helper ───────────────────────────────────────────────────
function ensureArray(val) {
  if (Array.isArray(val)) return val
  if (!val) return []
  if (typeof val === 'object') return Object.values(val)
  if (typeof val === 'string') {
    return val.includes('\n')
      ? val.split('\n').map((s) => s.trim()).filter(Boolean)
      : [val.trim()]
  }
  return []
}

const CATEGORIES = [
  {
    key: 'hr_questions',
    label: 'HR & Behavioral',
    desc: 'Culture fit, teamwork & conflict resolution',
    dot: 'bg-accent',
    textColor: 'text-accent',
    badgeClass: 'badge-blue',
  },
  {
    key: 'technical_questions',
    label: 'Technical Proficiency',
    desc: 'Core architecture, tooling & language depth',
    dot: 'bg-violet',
    textColor: 'text-violet',
    badgeClass: 'badge-violet',
  },
  {
    key: 'resume_based_questions',
    label: 'Resume Deep-Dive',
    desc: 'Validation of listed achievements & roles',
    dot: 'bg-success',
    textColor: 'text-success',
    badgeClass: 'badge-green',
  },
  {
    key: 'project_based_questions',
    label: 'System & Project Execution',
    desc: 'Trade-offs, scaling & delivery decisions',
    dot: 'bg-amber',
    textColor: 'text-amber',
    badgeClass: 'badge-amber',
  },
]

export default function InterviewQuestions() {
  const { resumeId, jdId, loading, resumes, jds } = useSelection()
  const [result, setResult] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [activeCategory, setActiveCategory] = useState('hr_questions')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!resumeId) return
    setGenerating(true)
    setError('')
    try {
      const { data } = await generateAPI.interviewQuestions({
        resume_id: parseInt(resumeId),
        jd_id: jdId ? parseInt(jdId) : null,
        count_per_category: 5,
      })
      setResult(data)
    } catch (err) {
      console.error('Interview questions error:', err)
      setError('Failed to generate interview questions. Please verify your connection.')
    } finally {
      setGenerating(false)
    }
  }

  const copyQuestion = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
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

  const selectedResume = resumes.find((r) => String(r.id) === String(resumeId))
  const selectedJd = jds.find((j) => String(j.id) === String(jdId))
  const activeQuestions = ensureArray(result?.[activeCategory])

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="AI Interview Preparation"
        description="Tailored questions synthesized from your credentials and target job requirements"
        actions={
          <button
            onClick={generate}
            disabled={!resumeId || generating}
            className="btn-primary"
          >
            {generating ? (
              <>
                <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Synthesizing...
              </>
            ) : result ? (
              'Regenerate Questions'
            ) : (
              'Generate Questions'
            )}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-6xl mx-auto w-full">
        {/* ── Context & Configuration ── */}
        <div className="card p-5">
          <p className="label-uppercase mb-3">Interview Context</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface/40 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Candidate Resume
              </span>
              <p className="mt-1 text-[13px] font-bold text-ink truncate">
                {selectedResume?.filename || 'No resume selected'}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface/40 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Target Role Benchmark
              </span>
              <p className="mt-1 text-[13px] font-bold text-ink truncate">
                {selectedJd?.title || 'General Industry Profile'}
              </p>
            </div>
          </div>

          {!resumeId && (
            <div className="mt-3 text-[12px] text-amber font-medium">
              Please upload a resume first to generate tailored interview questions.{' '}
              <Link to="/resume" className="underline font-bold">
                Upload now →
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger-muted bg-danger-light p-3 text-[12px] text-danger dark:bg-danger/15">
              <span className="font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ── Main Questions View ── */}
        {generating ? (
          <div className="card p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-accent dark:bg-accent/15">
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-ink">Generating Question Set...</h3>
              <p className="mt-1 text-[13px] text-ink-secondary">
                Analyzing resume bullet points, skills inventory, and JD requirements to formulate rigorous interview probes.
              </p>
            </div>
          </div>
        ) : !result ? (
          /* Empty / Preview State */
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="card p-4 transition-all hover:border-accent/40">
                  <div className={`mb-2.5 h-2 w-2 rounded-full ${cat.dot}`} />
                  <h4 className="text-[13px] font-bold text-ink">{cat.label}</h4>
                  <p className="mt-1 text-[11px] text-ink-muted leading-relaxed">{cat.desc}</p>
                  <span className="mt-3 inline-block text-[10px] font-semibold text-accent">
                    5 curated questions
                  </span>
                </div>
              ))}
            </div>

            <div className="card p-10 text-center">
              <h3 className="text-[15px] font-bold text-ink">Ready to simulate interview</h3>
              <p className="mt-1 text-[12px] text-ink-muted max-w-sm mx-auto">
                Click &quot;Generate Questions&quot; above to produce AI-tailored questions categorized across HR, technical, and resume-specific domains.
              </p>
            </div>
          </div>
        ) : (
          /* Active Results View */
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* ── Category Sidebar Tabs ── */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.key
                const count = ensureArray(result[cat.key]).length
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? 'border border-accent/30 bg-accent-light dark:bg-accent/15 shadow-sm'
                        : 'border border-transparent bg-card hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${cat.dot}`} />
                        <span className={`text-[13px] font-semibold truncate ${
                          isSelected ? 'text-accent' : 'text-ink'
                        }`}>
                          {cat.label}
                        </span>
                      </div>
                      <span className={`badge ${cat.badgeClass} text-[10px]`}>
                        {count}
                      </span>
                    </div>
                    <p className="mt-1 pl-4 text-[10px] text-ink-muted leading-tight truncate">
                      {cat.desc}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* ── Questions Feed ── */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center justify-between px-1">
                <span className="label-uppercase">
                  {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {activeQuestions.length} practice prompts
                </span>
              </div>

              {activeQuestions.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-[13px] text-ink-muted italic">
                    No questions generated in this category.
                  </p>
                </div>
              ) : (
                activeQuestions.map((q, idx) => {
                  const qText = typeof q === 'string' ? q : q?.question || JSON.stringify(q)
                  const isCopied = copiedIndex === idx

                  return (
                    <div
                      key={idx}
                      className="card p-4 transition-all hover:border-accent/30 hover:shadow-card-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-surface border border-border text-[11px] font-bold text-ink-muted mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium leading-relaxed text-ink">
                              {qText}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-muted">
                              <span className="badge-neutral">Suggested Response Focus</span>
                              <span>Use the STAR method (Situation, Task, Action, Result)</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => copyQuestion(qText, idx)}
                          className="btn-icon h-7 w-7 text-ink-muted hover:text-accent"
                          title="Copy question text"
                        >
                          {isCopied ? (
                            <span className="text-[10px] font-bold text-success">✓</span>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                              <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                              <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" strokeWidth="1.3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
