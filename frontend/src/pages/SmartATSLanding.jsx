import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  FileText,
  BarChart3,
  Search,
  Download,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

import LandingNavbar from '../components/landing/LandingNavbar';
import ResumeIllustration from '../components/landing/ResumeIllustration';
import FeatureCards from '../components/landing/FeatureCards';
import StatsSection from '../components/landing/StatsSection';
import TrustSection from '../components/landing/TrustSection';
import DemoModal from '../components/landing/DemoModal';

export default function SmartATSLanding() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth?mode=signup');
  };

  const handleQuickShortcut = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#070913] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
      }`}
    >
      {/* Background Deep Ambience & Radial Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top Center Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] blur-3xl opacity-80 ${
            isDark
              ? 'bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent'
              : 'bg-gradient-to-b from-blue-500/10 via-indigo-500/05 to-transparent'
          }`}
        />
        {/* Left Purple Accent Glow */}
        <div
          className={`absolute top-[20%] -left-32 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDark ? 'bg-purple-600/10' : 'bg-purple-500/06'
          }`}
        />
        {/* Right Cyan Accent Glow */}
        <div
          className={`absolute top-[30%] -right-32 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/06'
          }`}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Header / Top Navigation */}
      <LandingNavbar
        onOpenDemo={() => setDemoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ── HERO SECTION ────────────────────────────────────────── */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* ── LEFT COLUMN: Value Proposition & Hero CTA ─────────── */}
            <div className="lg:col-span-4 xl:col-span-5 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md shadow-sm ${
                  isDark
                    ? 'bg-white/[0.05] border-white/[0.12] text-slate-300'
                    : 'bg-white/85 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-sm">🚀</span>
                <span className={isDark ? 'text-white' : 'text-slate-900 font-bold'}>AI-Powered</span>
                <span className="text-slate-400">\</span>
                <span className="text-blue-600 dark:text-cyan-300 font-semibold">ATS Friendly</span>
                <span className="text-slate-400 hidden sm:inline">\</span>
                <span className="text-emerald-600 dark:text-emerald-300 hidden sm:inline font-semibold">Get Hired Faster</span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ATS Resume Builder <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    & Score Analyzer
                  </span>
                </h1>
              </motion.div>

              {/* Supporting Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Create professional, ATS-optimized resumes, get instant AI feedback, and improve your chances of landing interviews.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1"
              >
                {/* Primary CTA */}
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/20"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => setDemoOpen(true)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border ${
                    isDark
                      ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.12] text-slate-200 hover:text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-slate-950'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isDark ? 'fill-white' : 'fill-slate-800'}`} />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>ATS optimized</span>
                </div>
              </motion.div>
            </div>

            {/* ── CENTER COLUMN: Floating Resume Illustration ─────────── */}
            <div className="lg:col-span-4 xl:col-span-4 flex justify-center py-2 lg:py-0">
              <ResumeIllustration />
            </div>

            {/* ── RIGHT COLUMN: Premium Get Started Panel ─────────── */}
            <div className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-end">
              <div
                className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-7 backdrop-blur-2xl border relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)] ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
                style={{
                  background: isDark
                    ? 'linear-gradient(160deg, rgba(29,37,64,0.9), rgba(15,17,32,0.95))'
                    : 'linear-gradient(160deg, #ffffff, #eef2ff)',
                }}
              >
                {/* Ambient glows */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold mb-5 bg-white/[0.06] border-white/0 text-blue-600 dark:text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" /> Unlock Your Career Potential
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Build a resume that{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                      gets interviews
                    </span>
                  </h3>

                  <ul className="mt-6 space-y-3 text-sm">
                    {[
                      'ATS-optimized resume builder',
                      'Instant AI compatibility scoring',
                      '10+ professional templates',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStarted}
                    className="w-full mt-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-white/20"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/auth?mode=signin')}
                    className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-[0.98] cursor-pointer bg-white/[0.04] hover:bg-white/[0.1] border-white/0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Already have an account? <span className="font-bold text-blue-600 dark:text-cyan-400">Log In</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE SHORTCUTS (as visible on mobile screen) ─────── */}
          <div className="lg:hidden mt-8 grid grid-cols-4 gap-2.5 max-w-md mx-auto">
            <button
              onClick={() => handleQuickShortcut('/templates')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center cursor-pointer ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Templates
              </span>
            </button>

            <button
              onClick={() => handleQuickShortcut('/upload')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center cursor-pointer ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Analysis
              </span>
            </button>

            <button
              onClick={() => handleQuickShortcut('/upload')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center cursor-pointer ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-300">
                <Search className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Job Match
              </span>
            </button>

            <button
              onClick={() => handleQuickShortcut('/builder')}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center cursor-pointer ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-blue-600 dark:text-cyan-300">
                <Download className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Download
              </span>
            </button>
          </div>
        </section>

        {/* ── 4 FEATURE CARDS ──────────────────────────────────────── */}
        <FeatureCards />

        {/* ── STATISTICS SECTION ───────────────────────────────────── */}
        <StatsSection />

        {/* ── TRUSTED LOGOS SECTION ────────────────────────────────── */}
        <TrustSection />
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        className={`w-full border-t backdrop-blur-xl py-6 text-center text-xs transition-colors duration-300 ${
          isDark
            ? 'border-white/[0.08] bg-slate-950/80 text-slate-500'
            : 'border-slate-200 bg-white/80 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>SmartATS</span>
            <span>·</span>
            <span>Build Smart · Get Hired</span>
          </div>
          <div className={`flex items-center gap-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <button onClick={() => setDemoOpen(true)} className="hover:text-blue-600 dark:hover:text-white cursor-pointer">
              Interactive Demo
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="hover:text-blue-600 dark:hover:text-white cursor-pointer"
            >
              LaTeX Gallery
            </button>
            <button
              onClick={() => navigate('/builder')}
              className="hover:text-blue-600 dark:hover:text-white cursor-pointer"
            >
              Resume Studio
            </button>
          </div>
          <p>© {new Date().getFullYear()} SmartATS Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* ── MODALS ───────────────────────────────────────────────── */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onGetStarted={handleGetStarted}
      />
    </div>
  );
}

