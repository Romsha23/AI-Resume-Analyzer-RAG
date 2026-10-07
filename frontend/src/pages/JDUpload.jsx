import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jdAPI, formatApiError } from '../services/api'
import PageHeader from '../components/PageHeader'

export default function JDUpload() {
  const [tab, setTab] = useState('text')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [jds, setJds] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [selectedJd, setSelectedJd] = useState(null)
  const [search, setSearch] = useState('')

  const loadJds = () => {
    return jdAPI
      .list()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : []
        setJds(list)
        if (list.length && !selectedJd) {
          setSelectedJd(list[0])
        }
      })
      .catch((err) => {
        console.error('Failed to load JDs:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadJds()
  }, [])

  const submitText = async () => {
    if (!title.trim() || text.length < 10) return
    setSubmitting(true)
    setMessage('')
    setError('')
    try {
      const res = await jdAPI.uploadText({ title: title.trim(), text: text.trim() })
      setMessage(`Job description "${title.trim()}" saved successfully.`)
      setText('')
      setTitle('')
      await loadJds()
      if (res.data) setSelectedJd(res.data)
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const submitPdf = useCallback(
    async (file) => {
      if (!file) return
      setSubmitting(true)
      setMessage('')
      setError('')
      const form = new FormData()
      form.append('title', title.trim() || file.name.replace(/\.[^/.]+$/, ''))
      form.append('file', file)
      try {
        const res = await jdAPI.upload(form)
        setMessage(`Job file "${file.name}" uploaded successfully.`)
        setTitle('')
        await loadJds()
        if (res.data) setSelectedJd(res.data)
      } catch (err) {
        setError(formatApiError(err))
      } finally {
        setSubmitting(false)
      }
    },
    [title],
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.[0]) {
      submitPdf(e.dataTransfer.files[0])
    }
  }

  const filteredJds = jds.filter((j) =>
    !search || j.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="Analyze a Job Description"
        description="Save target job roles from plain text or PDF to benchmark against candidate resumes"
        actions={
          jds.length > 0 && (
            <Link to="/match" className="btn-primary text-[12px] py-1.5 gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5.5 8l2 2L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Go to Match Report
            </Link>
          )
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* ── Left Editor / Form ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {/* Tab switch */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex rounded-xl border border-border bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setTab('text')}
                  className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-all ${
                    tab === 'text' ? 'bg-card text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setTab('pdf')}
                  className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-all ${
                    tab === 'pdf' ? 'bg-card text-ink shadow-sm' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  Upload PDF
                </button>
              </div>

              <span className="text-[11px] text-ink-muted">
                {tab === 'text' ? 'Quick text input' : 'Document extraction'}
              </span>
            </div>

            {/* Title Field */}
            <div className="card p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                  Job Title or Role Name <span className="text-danger">*</span>
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Senior Full-Stack Engineer, Product Manager"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {tab === 'text' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-semibold text-ink">
                      Job Description Text <span className="text-danger">*</span>
                    </label>
                    <span className="text-[11px] text-ink-muted font-mono">{text.length} characters</span>
                  </div>
                  <textarea
                    className="input-field min-h-[300px] font-mono text-[12px] leading-relaxed"
                    placeholder="Paste the full job requirements, qualifications, and responsibilities here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={submitting}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[11px] text-ink-muted">
                      Requires at least 10 characters to save and analyze.
                    </p>
                    <button
                      onClick={submitText}
                      disabled={submitting || text.length < 10 || !title.trim()}
                      className="btn-primary"
                    >
                      {submitting ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Processing...
                        </>
                      ) : (
                        'Save & Index Job Description'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                      dragging
                        ? 'border-accent bg-accent-light dark:bg-accent/10'
                        : 'border-border hover:border-accent/40 hover:bg-surface/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(e) => {
                        if (e.target.files?.[0]) submitPdf(e.target.files[0])
                      }}
                      disabled={submitting}
                    />
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-light text-accent dark:bg-accent/15">
                      {submitting ? (
                        <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                          <path d="M9 3v9M5 8l4-5 4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-ink">
                      {submitting ? 'Uploading & parsing JD...' : 'Upload JD in PDF format'}
                    </p>
                    <p className="mt-1 text-[12px] text-ink-muted">Drag and drop file here, or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Notifications */}
            {message && (
              <div className="flex items-start gap-2.5 rounded-xl border border-success-muted bg-success-light p-3 text-[12px] text-success dark:bg-success/15">
                <span className="font-bold">✓</span>
                <span className="flex-1">{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-danger-muted bg-danger-light p-3 text-[12px] text-danger dark:bg-danger/15">
                <span className="font-bold">✕</span>
                <span className="flex-1">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Saved JDs List ── */}
        <div className="flex w-full flex-col border-t border-border bg-card lg:w-80 lg:flex-shrink-0 lg:border-t-0 lg:border-l">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[13px] font-bold text-ink">Saved Job Postings</h3>
              <span className="badge-neutral text-[10px]">{jds.length} roles</span>
            </div>
            <div className="relative">
              <input
                className="input-search w-full"
                placeholder="Search saved JDs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl skeleton" />
                ))}
              </div>
            ) : filteredJds.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink-muted">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M5 2.5H3.5A1 1 0 002.5 3.5v10a1 1 0 001 1h9a1 1 0 001-1v-10a1 1 0 00-1-1H11" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                </div>
                <p className="text-[12px] font-medium text-ink">No JDs saved</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">Add one using the form on the left</p>
              </div>
            ) : (
              filteredJds.map((j) => {
                const isSelected = selectedJd?.id === j.id
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJd(j)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all ${
                      isSelected
                        ? 'border-accent/30 bg-accent-light dark:bg-accent/15 shadow-sm'
                        : 'border-transparent hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`truncate text-[13px] font-semibold ${isSelected ? 'text-accent' : 'text-ink'}`}>
                        {j.title}
                      </p>
                      <span className="badge-neutral text-[9px] uppercase">
                        {j.source_type === 'pdf' ? 'PDF' : 'Text'}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-muted">
                      <span>ID #{j.id}</span>
                      <Link
                        to="/match"
                        className="font-medium text-accent hover:underline flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Compare →
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
