import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI, formatApiError } from '../services/api'
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

// ─── Drag & Drop Zone ─────────────────────────────────────────────────────────
function UploadZone({ onFile, uploading, uploadProgress }) {
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (file) => {
      if (!file) return
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a valid PDF document.')
        return
      }
      onFile(file)
    },
    [onFile],
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
        dragging
          ? 'border-accent bg-accent-light dark:bg-accent/10'
          : 'border-border hover:border-accent/50 hover:bg-surface/50'
      }`}
    >
      <input
        type="file"
        accept=".pdf"
        id="resume-file-input"
        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0])
        }}
        disabled={uploading}
      />

      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light text-accent dark:bg-accent/15">
        {uploading ? (
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V4M12 4L7 9M12 4L17 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <p className="text-[13px] font-semibold text-ink">
        {uploading ? 'Processing resume with AI...' : 'Upload your resume'}
      </p>
      <p className="mt-1 text-[11px] text-ink-muted">
        Drag and drop or click to browse (PDF only, up to 10MB)
      </p>

      {uploading && (
        <div className="mt-3 w-full max-w-[200px]">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-accent" />
          </div>
          <span className="mt-1 block text-[10px] text-ink-muted">Extracting entities & skills...</span>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeUpload() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('intelligence') // intelligence | raw

  const loadResumes = () => {
    return resumeAPI
      .list()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : []
        setResumes(list)
        if (list.length && !selected) {
          setSelected(list[0])
        } else if (list.length && selected) {
          // Keep selection or pick updated
          const found = list.find((r) => r.id === selected.id)
          if (found) setSelected(found)
        }
      })
      .catch((err) => {
        console.error('Failed to load resumes:', err)
        setError('Unable to load resume list.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    setMessage('')
    try {
      const { data } = await resumeAPI.upload(file)
      setMessage(`"${data.filename || file.name}" uploaded and parsed successfully.`)
      await loadResumes()
      setSelected(data)
    } catch (err) {
      console.error('Upload failed:', err)
      setError(formatApiError(err))
    } finally {
      setUploading(false)
    }
  }

  const pd = selected?.parsed_data || {}
  const skills = ensureArray(pd.skills)
  const experience = ensureArray(pd.experience)
  const education = ensureArray(pd.education)
  const projects = ensureArray(pd.projects)

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="Resume Intelligence"
        description="Upload resumes, inspect parsed credentials, and review extracted profile data"
        actions={
          selected && (
            <div className="flex items-center gap-2">
              <Link to="/ats" className="btn-secondary text-[12px] py-1.5 gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 11L5 7 7.5 9.5 10.5 5.5 14 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Run ATS Check
              </Link>
              <Link to="/match" className="btn-primary text-[12px] py-1.5 gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 8l2 2L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Compare to JD
              </Link>
            </div>
          )
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* ── Left Column: Upload & Resumes List ── */}
        <div className="flex w-full flex-col border-b border-border bg-card lg:w-80 lg:flex-shrink-0 lg:border-b-0 lg:border-r">
          <div className="p-4 border-b border-border">
            <UploadZone onFile={handleUpload} uploading={uploading} />
            {message && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-success-muted bg-success-light p-2.5 text-[12px] text-success dark:bg-success/15">
                <span className="font-bold">✓</span>
                <span className="flex-1">{message}</span>
              </div>
            )}
            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger-muted bg-danger-light p-2.5 text-[12px] text-danger dark:bg-danger/15">
                <span className="font-bold">✕</span>
                <span className="flex-1">{error}</span>
              </div>
            )}
          </div>

          {/* List Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/40">
            <span className="label-uppercase">Uploaded Resumes</span>
            <span className="badge-neutral text-[10px]">{resumes.length} files</span>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl skeleton" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink-muted">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 1.5H9.5L13 5V14.5H3.5V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[12px] font-medium text-ink">No resumes yet</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">Upload a PDF above to begin</p>
              </div>
            ) : (
              resumes.map((r) => {
                const isSel = selected?.id === r.id
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`w-full rounded-xl p-3 text-left transition-all ${
                      isSel
                        ? 'border border-accent/30 bg-accent-light dark:bg-accent/15 shadow-sm'
                        : 'border border-transparent hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                        isSel ? 'bg-accent text-white' : 'bg-surface text-ink-secondary'
                      }`}>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M3.5 1.5H9.5L13 5V14.5H3.5V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                          <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-[12px] font-semibold ${isSel ? 'text-accent' : 'text-ink'}`}>
                          {r.filename}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-ink-muted">
                          <span>{new Date(r.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="text-success font-medium">Ready</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right Column: Resume Details & Extracted Intelligence ── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-canvas">
          {!selected ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink-muted">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h8l5 5v13H7V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M15 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-ink">No resume selected</h3>
              <p className="mt-1 max-w-sm text-[12px] text-ink-muted">
                Select an uploaded file from the left sidebar or drag and drop a new PDF resume.
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-w-5xl mx-auto">
              {/* File Info Banner */}
              <div className="card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent dark:bg-accent/15">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 1.5H9.5L13 5V14.5H3.5V1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                      <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[14px] font-bold text-ink truncate">{selected.filename}</h2>
                    <p className="text-[11px] text-ink-muted">
                      Uploaded on {new Date(selected.created_at).toLocaleString()} • ID #{selected.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge-green">AI Parsed</span>
                  <div className="flex rounded-lg border border-border bg-surface p-0.5">
                    <button
                      onClick={() => setActiveTab('intelligence')}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        activeTab === 'intelligence' ? 'bg-card text-ink shadow-sm' : 'text-ink-secondary'
                      }`}
                    >
                      Intelligence
                    </button>
                    <button
                      onClick={() => setActiveTab('raw')}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        activeTab === 'raw' ? 'bg-card text-ink shadow-sm' : 'text-ink-secondary'
                      }`}
                    >
                      Raw JSON
                    </button>
                  </div>
                </div>
              </div>

              {activeTab === 'raw' ? (
                /* Raw JSON Inspection */
                <div className="card p-5">
                  <p className="label-uppercase mb-2">Parsed Entity Dump</p>
                  <pre className="max-h-[500px] overflow-auto rounded-xl bg-surface p-4 text-[11px] font-mono text-ink leading-relaxed">
                    {JSON.stringify(pd, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Intelligence View */
                <div className="space-y-5">
                  {/* Profile & Summary */}
                  <div className="card p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                      <span className="label-uppercase">Candidate Profile</span>
                      <span className="text-[11px] text-ink-muted">Extracted Identity</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                      <div className="rounded-xl border border-border bg-surface/50 p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Full Name</span>
                        <p className="mt-1 text-[13px] font-bold text-ink truncate">{pd.name || 'Not detected'}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/50 p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Email</span>
                        <p className="mt-1 text-[13px] font-medium text-ink truncate">{pd.email || 'Not detected'}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/50 p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Phone</span>
                        <p className="mt-1 text-[13px] font-medium text-ink truncate">{pd.phone || 'Not detected'}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/50 p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Location</span>
                        <p className="mt-1 text-[13px] font-medium text-ink truncate">{pd.location || 'Not detected'}</p>
                      </div>
                    </div>

                    {pd.summary && (
                      <div className="mt-4 rounded-xl border border-border bg-surface/30 p-3.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                          Executive Summary
                        </span>
                        <p className="text-[12px] leading-relaxed text-ink-secondary">{pd.summary}</p>
                      </div>
                    )}
                  </div>

                  {/* Skills Grid */}
                  <div className="card p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                      <span className="label-uppercase">Extracted Skills</span>
                      <span className="badge-blue text-[10px]">{skills.length} skills identified</span>
                    </div>

                    {skills.length === 0 ? (
                      <p className="text-[12px] text-ink-muted italic py-2">No skills could be automatically parsed from this document.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map((s, idx) => {
                          const str = typeof s === 'string' ? s : s?.name || JSON.stringify(s)
                          return (
                            <span
                              key={idx}
                              className="skill-tag bg-surface border-border text-ink hover:border-accent/40 transition-colors"
                            >
                              {str}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Experience Timeline */}
                  <div className="card p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                      <span className="label-uppercase">Work Experience</span>
                      <span className="text-[11px] text-ink-muted">{experience.length} roles found</span>
                    </div>

                    {experience.length === 0 ? (
                      <p className="text-[12px] text-ink-muted italic py-2">No work experience entries detected.</p>
                    ) : (
                      <div className="space-y-4">
                        {experience.map((exp, idx) => {
                          const role = exp?.role || exp?.title || exp?.position || 'Role not specified'
                          const company = exp?.company || exp?.organization || exp?.employer || 'Company'
                          const duration = exp?.duration || exp?.dates || exp?.period || ''
                          const desc = exp?.description || exp?.summary || exp?.details

                          return (
                            <div
                              key={idx}
                              className="relative pl-5 before:absolute before:left-1 before:top-2 before:bottom-0 before:w-px before:bg-border last:before:hidden"
                            >
                              <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-card" />
                              <div className="rounded-xl border border-border bg-surface/30 p-3.5">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <h4 className="text-[13px] font-bold text-ink">{role}</h4>
                                  {duration && (
                                    <span className="badge-neutral text-[10px]">{duration}</span>
                                  )}
                                </div>
                                <p className="text-[12px] font-medium text-accent mt-0.5">{company}</p>
                                {desc && (
                                  <p className="mt-2 text-[12px] leading-relaxed text-ink-secondary">{desc}</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Education & Projects (2 Columns) */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Education */}
                    <div className="card p-5">
                      <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                        <span className="label-uppercase">Education</span>
                        <span className="badge-neutral text-[10px]">{education.length}</span>
                      </div>

                      {education.length === 0 ? (
                        <p className="text-[12px] text-ink-muted italic py-2">No education entries found.</p>
                      ) : (
                        <div className="space-y-3">
                          {education.map((edu, idx) => {
                            const degree = edu?.degree || edu?.field || edu?.qualification || 'Degree'
                            const school = edu?.institution || edu?.school || edu?.university || 'Institution'
                            const year = edu?.year || edu?.graduation_year || edu?.date || ''

                            return (
                              <div key={idx} className="rounded-xl border border-border bg-surface/40 p-3">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="text-[12px] font-bold text-ink">{degree}</h4>
                                  {year && <span className="text-[10px] text-ink-muted font-medium">{year}</span>}
                                </div>
                                <p className="text-[11px] text-ink-secondary mt-0.5">{school}</p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Projects / Additions */}
                    <div className="card p-5">
                      <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                        <span className="label-uppercase">Projects & Additional</span>
                        <span className="badge-neutral text-[10px]">{projects.length}</span>
                      </div>

                      {projects.length === 0 ? (
                        <p className="text-[12px] text-ink-muted italic py-2">No project entries listed in parsed data.</p>
                      ) : (
                        <div className="space-y-3">
                          {projects.map((proj, idx) => {
                            const title = proj?.title || proj?.name || `Project ${idx + 1}`
                            const desc = proj?.description || ''
                            return (
                              <div key={idx} className="rounded-xl border border-border bg-surface/40 p-3">
                                <h4 className="text-[12px] font-bold text-ink">{title}</h4>
                                {desc && <p className="text-[11px] text-ink-secondary mt-1">{desc}</p>}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
