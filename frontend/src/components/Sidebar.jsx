import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { resumeAPI } from '../services/api'

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  resume: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 1.5H9.5L13 5V14.5H3.5V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M6 8h4M6 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  jd: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M5 2.5H3.5A1 1 0 002.5 3.5v10a1 1 0 001 1h9a1 1 0 001-1v-10a1 1 0 00-1-1H11" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="5" y="1.5" width="6" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 7h5M5.5 9.5h5M5.5 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  ats: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 11L5 7 7.5 9.5 10.5 5.5 14 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="9" r="1.2" fill="currentColor"/>
    </svg>
  ),
  match: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 8l2 2L11 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chat: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 3.5C2.5 2.95 2.95 2.5 3.5 2.5h9c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H8.5L6 13V10.5H3.5c-.55 0-1-.45-1-1v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5.5 6.5h5M5.5 8.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  interview: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="1.5" width="6" height="8.5" rx="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 8.5c0 2.76 2.24 5 5 5s5-2.24 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8 13.5V15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  logout: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M10 2.5H13.5V13.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 11L10 8 6.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 8H2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

const GENERAL_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
]

const WORKSPACE_NAV = [
  { to: '/resume',    label: 'Resume',         icon: 'resume' },
  { to: '/jd',        label: 'Job Description', icon: 'jd' },
  { to: '/ats',       label: 'ATS Analysis',    icon: 'ats' },
  { to: '/match',     label: 'Match Report',    icon: 'match' },
  { to: '/chat',      label: 'AI Assistant',    icon: 'chat' },
  { to: '/interview', label: 'Interview Prep',  icon: 'interview' },
]

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? 'mb-0.5 flex items-center gap-2.5 rounded-xl border border-accent/20 bg-accent-light px-3 py-2 text-[13px] font-semibold text-accent transition-all dark:bg-accent/15'
          : 'mb-0.5 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink'
      }
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-accent' : 'text-ink-secondary'}>
            {Icons[icon]}
          </span>
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ onClose }) {
  const { logout, user } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [recentResumes, setRecentResumes] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    resumeAPI.list()
      .then(r => setRecentResumes((r.data || []).slice(0, 3)))
      .catch(() => {})
  }, [location.pathname])

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const filteredRecents = recentResumes.filter(r =>
    !search || r.filename.toLowerCase().includes(search.toLowerCase())
  )

  const handleNavClick = () => {
    if (onClose) onClose()
  }

  return (
    <aside className="flex h-full w-[240px] flex-shrink-0 flex-col border-r border-border bg-sidebar select-none">
      {/* ── Logo & Mobile Close ── */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-sm flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="0.8" fill="white"/>
              <rect x="7" y="1" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
              <rect x="1" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.75"/>
              <rect x="7" y="7" width="4" height="4" rx="0.8" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <span className="text-[15px] font-bold text-ink tracking-tight block leading-tight">ResumeIQ</span>
            <span className="text-[10px] text-ink-muted leading-none">Powered by Romsha Wadhwa</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="btn-icon md:hidden"
            aria-label="Close sidebar"
          >
            {Icons.close}
          </button>
        )}
      </div>

      {/* ── Search Bar ── */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {Icons.search}
          </span>
          <input
            className="input-search w-full"
            placeholder="Search workspace..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1 py-0.2 text-[9px] font-medium text-ink-muted">
            ⌘K
          </span>
        </div>
      </div>

      {/* ── Nav Sections ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* GENERAL */}
        <div>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            General
          </p>
          {GENERAL_NAV.map(item => (
            <NavItem key={item.to} {...item} onClick={handleNavClick} />
          ))}
        </div>

        {/* WORKSPACE */}
        <div>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Workspace
          </p>
          {WORKSPACE_NAV.map(item => (
            <NavItem key={item.to} {...item} onClick={handleNavClick} />
          ))}
        </div>

        {/* RECENT RESUMES */}
        {filteredRecents.length > 0 && (
          <div>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
              Recent Files
            </p>
            {filteredRecents.map((r, i) => {
              const colors = [
                'bg-accent-light text-accent dark:bg-accent/15',
                'bg-violet-light text-violet dark:bg-violet/15',
                'bg-rose-light text-rose dark:bg-rose/15',
              ]
              return (
                <NavLink
                  key={r.id}
                  to="/resume"
                  onClick={handleNavClick}
                  className="mb-0.5 flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px] text-ink-secondary hover:bg-surface hover:text-ink transition-colors"
                >
                  <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-[8px] font-bold ${colors[i % 3]}`}>
                    CV
                  </span>
                  <span className="min-w-0 truncate text-[12px]">{r.filename}</span>
                </NavLink>
              )
            })}
          </div>
        )}
      </nav>

      {/* ── User & Theme Controls ── */}
      <div className="border-t border-border px-3 py-2.5 space-y-1">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggle}
          className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-[12px] font-medium text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="flex items-center gap-2">
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
            <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          </div>
          <span className="text-[10px] text-ink-muted">{dark ? 'ON' : 'OFF'}</span>
        </button>

        {/* User bar + logout */}
        <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet text-[11px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-ink leading-tight">{user?.full_name || 'User'}</p>
            <p className="truncate text-[10px] text-ink-muted leading-tight">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="flex-shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-danger-light hover:text-danger dark:hover:bg-danger/15"
            title="Sign out"
          >
            {Icons.logout}
          </button>
        </div>
      </div>
    </aside>
  )
}
