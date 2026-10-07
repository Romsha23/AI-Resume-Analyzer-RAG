import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import GlobalAnimatedBackground from './components/GlobalAnimatedBackground'
import ATSAnalysis from './pages/ATSAnalysis'
import AIChatbot from './pages/AIChatbot'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import InterviewQuestions from './pages/InterviewQuestions'
import JDUpload from './pages/JDUpload'
import Login from './pages/Login'
import MatchReport from './pages/MatchReport'
import Register from './pages/Register'
import ResumeUpload from './pages/ResumeUpload'

export default function App() {
  return (
    <div className="relative min-h-screen text-ink antialiased">
      {/* ── Global Animated Aceternity Background ── */}
      <GlobalAnimatedBackground />

      {/* ── Foreground Application Content ── */}
      <div className="relative z-10 min-h-screen">
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
      </div>
    </div>
  )
}
