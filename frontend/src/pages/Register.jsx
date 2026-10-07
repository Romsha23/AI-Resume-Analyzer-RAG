import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* ── Left Form Panel ── */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-12">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="btn-icon absolute left-6 top-6"
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
          {/* Logo */}
          <Link to="/" className="mb-7 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white" />
                <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
                <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
                <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5" />
              </svg>
            </div>
            <span className="text-[16px] font-bold text-ink tracking-tight">ResumeIQ</span>
          </Link>

          <div className="mb-7">
            <h1 className="text-[24px] font-bold text-ink">Create your ResumeIQ account</h1>
            <p className="mt-1 text-[13px] text-ink-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent hover:underline">
                Sign in
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
                Full name
              </label>
              <input
                className="input-field"
                placeholder="Alex Carter"
                value={form.full_name}
                onChange={handleChange('full_name')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Work email address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="alex@company.com"
                value={form.email}
                onChange={handleChange('email')}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                  disabled={loading}
                  required
                  minLength={6}
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
                  Setting up workspace...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] text-ink-muted">
            By creating an account, you agree to the Terms of Service.
          </p>
        </div>
      </div>

      {/* ── Right Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[460px] lg:flex-shrink-0 lg:flex-col lg:justify-between px-10 py-12 border-l border-border"
        style={{
          background: dark
            ? 'linear-gradient(160deg, rgba(21, 24, 41, 0.88) 0%, rgba(13, 16, 23, 0.88) 100%)'
            : 'linear-gradient(160deg, rgba(245, 243, 255, 0.88) 0%, rgba(239, 246, 255, 0.88) 100%)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white" />
              <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
              <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75" />
              <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="text-[16px] font-bold text-ink">ResumeIQ</span>
        </div>

        <div className="space-y-6">
          <div>
            <span className="label-uppercase mb-2 text-violet">AI-Powered Advantage</span>
            <h2 className="text-[28px] font-extrabold leading-tight text-ink">
              Turn your resume into an interview magnet.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">
              Upload your resume and start analyzing ATS keyword penetration and role fit in under 60 seconds.
            </p>
          </div>

          <div className="card p-4 space-y-3 shadow-card-md">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[12px] font-bold text-ink">Included in Free Workspace</span>
              <span className="badge-green text-[10px]">Instant Access</span>
            </div>
            <ul className="space-y-2 text-[12px] text-ink-secondary">
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> PDF Resume Parsing & Structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> ATS Compatibility Score Gauge
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Job Description Skill Gap Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Ground-Truth RAG AI Assistant
              </li>
            </ul>
          </div>
        </div>

        <p className="text-[11px] text-ink-muted">
          Enterprise security • No data selling • 100% private
        </p>
      </div>
    </div>
  )
}
