import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import GlobalAnimatedBackground from './components/GlobalAnimatedBackground'

// Code-split pages for instant initial bundle loading and minimal memory footprint
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'))
const JDUpload = lazy(() => import('./pages/JDUpload'))
const ATSAnalysis = lazy(() => import('./pages/ATSAnalysis'))
const MatchReport = lazy(() => import('./pages/MatchReport'))
const AIChatbot = lazy(() => import('./pages/AIChatbot'))
const InterviewQuestions = lazy(() => import('./pages/InterviewQuestions'))

function PageFallback() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent/20 border-t-accent" />
        <span className="text-[12px] font-medium text-ink-muted">Loading workspace...</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen text-ink antialiased">
      {/* ── Global Animated Aceternity Background ── */}
      <GlobalAnimatedBackground />

      {/* ── Foreground Application Content ── */}
      <div className="relative z-10 min-h-screen">
        <Suspense fallback={<PageFallback />}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes inside Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/jd" element={<JDUpload />} />
            <Route path="/ats" element={<ATSAnalysis />} />
            <Route path="/match" element={<MatchReport />} />
            <Route path="/chat" element={<AIChatbot />} />
            <Route path="/interview" element={<InterviewQuestions />} />

            {/* Convenience route aliases */}
            <Route path="/job-description" element={<JDUpload />} />
            <Route path="/analysis" element={<ATSAnalysis />} />
            <Route path="/match-report" element={<MatchReport />} />
            <Route path="/ai-assistant" element={<AIChatbot />} />
            <Route path="/interview-prep" element={<InterviewQuestions />} />
            <Route path="/history" element={<Navigate to="/dashboard" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </div>
    </div>
  )
}
