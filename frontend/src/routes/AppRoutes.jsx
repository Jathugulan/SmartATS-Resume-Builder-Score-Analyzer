import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
const Home = lazy(() => import('../pages/Home'));
const Features = lazy(() => import('../pages/Features'));
const Templates = lazy(() => import('../pages/Templates'));
const HowItWorks = lazy(() => import('../pages/HowItWorks'));
const Pricing = lazy(() => import('../pages/Pricing'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Auth = lazy(() => import('../pages/Auth'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

// Authenticated Pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MyResumes = lazy(() => import('../pages/MyResumes'));
const ResumeNew = lazy(() => import('../pages/ResumeNew'));
const ResumeEditor = lazy(() => import('../pages/ResumeEditor'));
const ResumeAnalysis = lazy(() => import('../pages/ResumeAnalysis'));
const JobMatch = lazy(() => import('../pages/JobMatch'));
const ResumePreview = lazy(() => import('../pages/ResumePreview'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));

// Legacy Pages
const UploadPage = lazy(() => import('../pages/Upload'));
const Analyzing = lazy(() => import('../pages/Analyzing'));
const Results = lazy(() => import('../pages/Results'));
const History = lazy(() => import('../pages/History'));
const InterviewPrep = lazy(() => import('../pages/InterviewPrep'));

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <Routes>
        {/* ── Public Layout Routes (Home, Features, Templates, How It Works, Pricing) ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ── Auth Routes ── */}
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* ── Authenticated App Routes ── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resumes" element={<MyResumes />} />
          <Route path="/resumes/new" element={<ResumeNew />} />
          <Route path="/resumes/:id/edit" element={<ResumeEditor />} />
          <Route path="/resumes/:id/analysis" element={<ResumeAnalysis />} />
          <Route path="/resumes/:id/job-match" element={<JobMatch />} />
          <Route path="/resumes/:id/preview" element={<ResumePreview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Builder & Legacy Tool Routes */}
          <Route path="/builder" element={<Dashboard />} />
          <Route path="/builder/:id" element={<ResumeEditor />} />
          {/* Dashboard (sidebar) LaTeX Template route — lives INSIDE the protected AppLayout
              so it keeps the sidebar/navbar and does NOT drop users onto the public page. */}
          <Route path="/builder/templates" element={<Templates />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
