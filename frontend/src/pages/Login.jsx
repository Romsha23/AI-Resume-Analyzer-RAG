import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Invalid email or password.'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* ── Left Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[460px] lg:flex-shrink-0 lg:flex-col lg:justify-between px-10 py-12 border-r border-border"
        style={{
          background: dark
            ? 'linear-gradient(160deg, rgba(13, 16, 23, 0.88) 0%, rgba(21, 24, 41, 0.88) 100%)'
            : 'linear-gradient(160deg, rgba(239, 246, 255, 0.88) 0%, rgba(245, 243, 255, 0.88) 100%)',
        }}
      >
        {/* Top Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white" />
              <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
              <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
              <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="text-[16px] font-bold text-ink">ResumeIQ</span>
        </Link>

        {/* Center Pitch & Mock Card */}
        <div className="space-y-6">
          <div>
            <span className="label-uppercase mb-2 text-accent">Powered by Romsha Wadhwa</span>
            <h2 className="text-[28px] font-extrabold leading-tight text-ink">
              Know exactly where your resume stands.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">
              Real-time ATS scoring, skill gap detection, and AI recommendations built for ambitious engineers and professionals.
            </p>
          </div>

          {/* Subtle Product Visual Card */}
          <div className="card p-4 space-y-3 shadow-card-md">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[12px] font-bold text-ink">ATS Compatibility Verified</span>
              </div>
              <span className="badge-green text-[10px]">85% Score</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-ink-secondary">
              <div className="flex justify-between">
                <span>Keyword Coverage</span>
                <span className="font-semibold text-ink">High Match</span>
              </div>
              <div className="flex justify-between">
                <span>Semantic Alignment</span>
                <span className="font-semibold text-ink">Strong Fit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-[11px] text-ink-muted">
          ResumeIQ © 2026 • AI-Powered Resume & Job Intelligence
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-12">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="btn-icon absolute right-6 top-6"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M14 10.5A6.5 6.5 0 015.5 2a6.5 6.5 0 100 12 6.5 6.5 0 008.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white" />
                <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
                <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
                <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5" />
              </svg>
            </div>
            <span className="text-[16px] font-bold text-ink">ResumeIQ</span>
          </div>

          <div className="mb-7">
            <h1 className="text-[24px] font-bold text-ink">Welcome back</h1>
            <p className="mt-1 text-[13px] text-ink-secondary">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-accent hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger-muted bg-danger-light p-3 text-[12px] text-danger dark:bg-danger/15">
              <span className="font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Email address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                disabled={loading}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-ink">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2l12 12M6.7 6.7a2 2 0 002.6 2.6M9.9 5.3A5.8 5.8 0 008 5c-3.5 0-6 3-6 3a10.6 10.6 0 003.1 3.2m2.4.8c4 0 6.5-3 6.5-3a10.8 10.8 0 00-2.3-2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5Z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 w-full justify-center py-2.5 font-semibold"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
