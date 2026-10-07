import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelection } from '../hooks/useSelection'
import { chatAPI, formatApiError } from '../services/api'
import PageHeader from '../components/PageHeader'

const SUGGESTIONS = [
  'How well does my resume match this job?',
  'What key skills or technologies am I missing?',
  'What 3 things should I change in my resume?',
  'Explain my ATS score and how to improve it.',
  'Generate 3 behavioral questions for this role.',
]

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm mt-0.5">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 3.5C2.5 2.95 2.95 2.5 3.5 2.5h9c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H8.5L6 13V10.5H3.5c-.55 0-1-.45-1-1v-6Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <div
        className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-accent text-white shadow-sm'
            : 'card text-ink shadow-sm'
        }`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {msg.content}
      </div>

      {isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-surface border border-border text-ink-muted text-[11px] font-bold mt-0.5">
          You
        </div>
      )}
    </div>
  )
}

export default function AIChatbot() {
  const { resumeId, setResumeId, jdId, setJdId, loading, resumes, jds } = useSelection()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your ResumeIQ AI Career Assistant. I have indexed your resume and job description via RAG. Ask me anything about your qualifications, keywords, match score, or tailored interview strategies.',
    },
  ])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const send = async (questionText) => {
    const q = (questionText || input).trim()
    if (!q || !resumeId || sending) return

    setMessages((prev) => [...prev, { role: 'user', content: q }])
    setInput('')
    setSending(true)

    try {
      const { data } = await chatAPI.query({
        resume_id: parseInt(resumeId),
        jd_id: jdId ? parseInt(jdId) : null,
        question: q,
        session_id: sessionId,
      })
      setSessionId(data.session_id)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }])
    } catch (err) {
      console.error('Chat query failed:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, an error occurred while processing your query: ${formatApiError(err)}`,
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-48 skeleton" />
        <div className="h-16 skeleton" />
        <div className="h-96 skeleton" />
      </div>
    )
  }

  const selectedResume = resumes.find((r) => String(r.id) === String(resumeId))
  const selectedJd = jds.find((j) => String(j.id) === String(jdId))

  return (
    <div className="flex h-full flex-col animate-fade-in bg-canvas">
      <PageHeader
        title="ResumeIQ AI Assistant"
        description="Ground-truth RAG reasoning on your specific uploaded resume and job description"
        actions={
          <button
            onClick={() => {
              setMessages([
                {
                  role: 'assistant',
                  content:
                    'Conversation cleared. How can I assist you with your resume analysis today?',
                },
              ])
              setSessionId(null)
            }}
            className="btn-secondary text-[12px] py-1.5"
            title="Clear current session"
          >
            Reset Chat
          </button>
        }
      />

      {/* ── Context Selection Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-uppercase">RAG Context:</span>

          {/* Resume Picker */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[12px]">
            <span className="text-accent font-semibold">Resume:</span>
            <select
              className="bg-transparent font-medium text-ink outline-none cursor-pointer max-w-[160px] sm:max-w-[200px] truncate"
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

          {/* JD Picker */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[12px]">
            <span className="text-violet font-semibold">Job:</span>
            <select
              className="bg-transparent font-medium text-ink outline-none cursor-pointer max-w-[160px] sm:max-w-[200px] truncate"
              value={jdId}
              onChange={(e) => setJdId(e.target.value)}
            >
              <option value="">General (No JD)</option>
              {jds.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>Active Context Indexed</span>
        </div>
      </div>

      {/* ── Messages Feed ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {sending && (
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2.5 3.5h9v6H8.5L6 12V9.5H3.5v-6Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>
              <div className="card px-4 py-2.5 flex items-center gap-2 text-[12px] text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1">Reviewing candidate credentials...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Suggested Quick Prompts ── */}
      {messages.length <= 2 && (
        <div className="border-t border-border bg-card/60 px-4 py-2.5 sm:px-6 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl">
            <p className="label-uppercase mb-2">Suggested Questions</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => send(s)}
                  disabled={!resumeId || sending}
                  className="rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] text-ink-secondary hover:border-accent/40 hover:text-ink transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Input Composer ── */}
      <div className="border-t border-border bg-card p-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {!resumeId ? (
            <div className="rounded-xl border border-amber/30 bg-amber-light p-3 text-center text-[12px] text-amber dark:bg-amber/15">
              Please upload or select a resume above to start chatting with the AI assistant.{' '}
              <Link to="/resume" className="font-bold underline ml-1">
                Upload Resume →
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                className="input-field py-3 text-[13px]"
                placeholder="Ask anything about your resume, missing keywords, or interview fit..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={!input.trim() || sending}
                className="btn-primary h-11 px-4 flex-shrink-0"
                aria-label="Send query"
              >
                {sending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8l12-6-4.5 12-2.5-4.5L2 8Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
