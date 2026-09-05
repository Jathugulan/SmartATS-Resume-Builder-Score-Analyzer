import { useAuth } from '../../hooks/useAuth';
import { useLocation, useMatch, Link } from 'react-router-dom';
import { Plus, Upload } from 'lucide-react';
import ThemeToggleSwitch from '../common/ThemeToggleSwitch';

const routeInfo = {
  '/upload': { title: 'ATS Resume Audit', subtitle: 'Deep 7-dimensional scoring & parsing verification' },
  '/history': { title: 'Audit History', subtitle: 'Previous resume scan reports and diagnostic analytics' },
  '/builder': { title: 'Resume Studio', subtitle: 'Craft & tailor ATS-optimized resumes with live LaTeX engine' },
  '/templates': { title: 'LaTeX Template Gallery', subtitle: 'Overleaf-grade, ATS-parseable modular resume templates' },
  '/interview-prep': { title: 'AI Interview Studio', subtitle: 'Resume-grounded question generator & response scoring' },
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const isResults = useMatch('/results/:id');
  const isBuilderEdit = useMatch('/builder/:id');

  let title = 'ATS Platform Suite';
  let subtitle = 'Unified ATS Analysis & Builder Workspace';

  if (isResults) {
    title = 'ATS Diagnostic Report';
    subtitle = 'Detailed scoring breakdown, entity extraction, and gap analysis';
  } else if (isBuilderEdit) {
    title = 'Resume Editor Studio';
    subtitle = 'Real-time ATS score simulator, LaTeX preview & Overleaf exporter';
  } else if (routeInfo[location.pathname]) {
    title = routeInfo[location.pathname].title;
    subtitle = routeInfo[location.pathname].subtitle;
  }

  return (
    <header className="sticky top-0 z-20 navbar-surface px-4 sm:px-6 py-3.5 backdrop-blur-xl transition-colors duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title & Breadcrumb */}
        <div className="pl-12 lg:pl-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight navbar-title">{title}</h2>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ATS Simulator Active
            </div>
          </div>
          <p className="text-xs navbar-subtitle hidden sm:block truncate max-w-lg mt-0.5">{subtitle}</p>
        </div>

        {/* Action Shortcuts, Theme Toggle & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dashboard Theme Toggle Switch */}
          <ThemeToggleSwitch size="sm" />

          <Link
            to="/upload"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl navbar-action-secondary text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>Scan Resume</span>
          </Link>

          <Link
            to="/builder"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95 border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">New Resume</span>
          </Link>

          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l" style={{ borderColor: 'var(--border-separator)' }}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

