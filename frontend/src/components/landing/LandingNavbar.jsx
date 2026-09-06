import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggleSwitch from '../common/ThemeToggleSwitch';

export default function LandingNavbar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="w-full sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: isDark ? 'rgba(7, 10, 20, 0.85)' : 'rgba(255, 255, 255, 0.92)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Logo Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20 relative">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Smart</span>
              <span className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-cyan-400">ATS</span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 -mt-0.5">
              Build Smart <span className="text-blue-500 dark:text-cyan-400">·</span> Get Hired
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 dark:text-cyan-400 font-semibold transition-colors hover:text-blue-500 dark:hover:text-cyan-300 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('templates')}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Templates
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Theme Toggle Switch */}
          <ThemeToggleSwitch size="sm" />

          {/* Log In Button */}
          <button
            onClick={() => navigate('/auth?mode=signin')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.12] transition-all cursor-pointer shadow-sm"
          >
            Log In
          </button>

          {/* Get Started Button */}
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all active:scale-95 cursor-pointer border border-white/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggleSwitch size="sm" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>


      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-5 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-sm">
            <button
              onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-left text-cyan-400 font-semibold py-1.5"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-slate-300 hover:text-white py-1.5"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('templates')}
              className="text-left text-slate-300 hover:text-white py-1.5"
            >
              Templates
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left text-slate-300 hover:text-white py-1.5"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left text-slate-300 hover:text-white py-1.5"
            >
              Pricing
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/auth?mode=signin');
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.08] border border-white/[0.12] text-center"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/auth?mode=signup');
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-center shadow-lg shadow-indigo-600/30"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
