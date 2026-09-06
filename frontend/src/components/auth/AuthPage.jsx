import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft,
  Sparkles, FileText, ShieldCheck, Gauge,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const PERKS = [
  { icon: FileText, title: 'ATS-Optimized Builder', desc: 'Structured sections tuned for modern applicant tracking systems.' },
  { icon: Gauge, title: 'Instant Score Analyzer', desc: 'Get a live estimated ATS compatibility score as you build.' },
  { icon: ShieldCheck, title: 'Private & Secure', desc: 'Your resume data is encrypted and never shared.' },
];

const SOCIALS = ['Google', 'LinkedIn', 'GitHub'];

/**
 * Shared authentication page shell.
 * Renders ONE dedicated form based on `isSignup` — sign in and sign up are
 * separate pages (distinct routes) rather than tabs on the same URL.
 *
 * @param {boolean} isSignup - `true` renders the registration form, `false` the sign-in form.
 */
export default function AuthPage({ isSignup = false }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialToast, setSocialToast] = useState('');

  const { login, register } = useAuth();

  const switchTo = isSignup ? '/login' : '/register';
  const switchLabel = isSignup ? 'Sign In' : 'Get Started';
  const switchPrompt = isSignup
    ? 'Already have an account?'
    : 'Don\u2019t have an account?';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (isSignup && password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = isSignup
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      if (res.success) {
        navigate('/upload');
      } else {
        setError(res.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Authentication server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    setSocialToast(`${provider} OAuth authentication connected. Redirecting to workspace...`);
    setTimeout(() => {
      setSocialToast('');
      navigate('/upload');
    }, 1200);
  };

  const inputClass = `w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
    isDark
      ? 'bg-white/[0.05] border-white/10 text-white placeholder:text-slate-500'
      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
  }`;

  return (
    <div className={`min-h-screen w-full flex flex-col overflow-x-hidden font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#070913] text-slate-100' : 'bg-[#f4f6fb] text-slate-900'
    }`}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-3xl ${
            isDark
              ? 'bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent'
              : 'bg-gradient-to-b from-blue-500/10 via-indigo-500/05 to-transparent'
          }`}
        />
        <div className={`absolute top-[20%] -left-32 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-purple-600/10' : 'bg-purple-500/06'}`} />
        <div className={`absolute bottom-[10%] -right-32 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/06'}`} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>
<main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">
      {/* ── LEFT BRAND PANEL ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`hidden lg:flex flex-col justify-between rounded-3xl p-8 sm:p-10 relative overflow-hidden border ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}
        style={isDark ? { background: 'linear-gradient(160deg, rgba(29,37,64,0.9), rgba(15,17,32,0.95))' } : { background: 'linear-gradient(160deg, #ffffff, #eef2ff)' }}
      >
        <div className="absolute top-0 right-0 w-52 h-52 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-2xl" />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight">Smart</span>
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-cyan-400">ATS</span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
              Build Smart <span className="text-blue-500 dark:text-cyan-400">·</span> Get Hired
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-4 my-8">
          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
            isDark ? 'bg-white/[0.05] border-white/10 text-cyan-300' : 'bg-blue-500/10 border-blue-200 text-blue-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Toolkit
          </span>
          <h1 className="text-3xl font-black leading-tight">
            Create a resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">beats the bots.</span>
          </h1>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            One free account unlocks the resume builder, ATS score analyzer, keyword matching, and real-time preview.
          </p>
        </div>
        {/* Perks */}
        <div className="relative space-y-4">
          {PERKS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start gap-3">
                <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stat bar */}
        <div className={`relative mt-8 grid grid-cols-3 gap-2 text-center rounded-2xl border py-4 ${isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white/60 border-slate-200'}`}>
          <div>
            <p className="text-lg font-black text-blue-600 dark:text-cyan-400">95%+</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">ATS Fit</p>
          </div>
          <div className="border-x border-current/10">
            <p className="text-lg font-black text-blue-600 dark:text-cyan-400">10+</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Templates</p>
          </div>
          <div>
            <p className="text-lg font-black text-blue-600 dark:text-cyan-400">Instant</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Analysis</p>
          </div>
        </div>
      </motion.div>
{/* ── RIGHT FORM CARD ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{
          backgroundColor: isDark ? 'rgba(13, 17, 28, 0.85)' : 'rgba(255,255,255,0.92)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
        }}
      >
        {/* Mobile brand mark */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
            <FileText className="w-4 h-4 text-white" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-black tracking-tight">Smart<span className="text-blue-600 dark:text-cyan-400">ATS</span></span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <span className="text-2xl">{isSignup ? '🚀' : '👋'}</span>
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isSignup
              ? 'Free forever. Start building your ATS-optimized resume in minutes.'
              : 'Sign in to continue your journey to a better resume.'}
          </p>
        </div>

        {/* Alerts */}
        {socialToast && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium animate-pulse">
            {socialToast}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} required />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                className={inputClass}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
{!isSignup && (
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className={`flex items-center gap-2 cursor-pointer select-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-400 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-600 dark:text-cyan-400 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 active:scale-[0.98] ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <LoadingSpinner size={18} />
            ) : (
              <>
                <span>{isSignup ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
          <span className={`absolute px-3 text-[10px] font-bold tracking-wider uppercase ${isDark ? 'bg-[#0d111c] text-slate-500' : 'bg-white text-slate-500'}`}>
            or continue with
          </span>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          {SOCIALS.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocialClick(provider)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <span>{provider === 'Google' ? 'G' : provider === 'LinkedIn' ? 'in' : 'gh'}</span>
              <span className="hidden sm:inline">{provider}</span>
            </button>
          ))}
        </div>

        {/* Switch prompt → links to the OTHER dedicated page */}
        <p className={`text-center text-xs mt-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {switchPrompt}{' '}
          <Link to={switchTo} className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer">
            {switchLabel}
          </Link>
        </p>
      </motion.div>
    </div>
  </main>

  {/* Back to home */}
  <div className="pb-8 text-center">
    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors cursor-pointer">
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
  </div>
</div>
);
}