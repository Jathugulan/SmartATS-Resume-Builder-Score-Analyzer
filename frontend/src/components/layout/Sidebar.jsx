import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Upload,
  History,
  LogOut,
  FileCode,
  LayoutTemplate,
  MessageSquareCode,
  ChevronLeft,
  Menu,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  LayoutDashboard,
  FolderKanban,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navGroups = [
  {
    title: 'ATS PLATFORM',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/resumes', label: 'My Resumes', icon: FolderKanban, badge: 'ATS v2' },
      { to: '/upload', label: 'Scan & Audit', icon: Upload, badge: 'AI Audit' },
      { to: '/history', label: 'Scan History', icon: History },
    ],
  },
  {
    title: 'RESUME STUDIO',
    items: [
      { to: '/resumes/new', label: 'New Resume', icon: FileCode, badge: 'Builder' },
      { to: '/builder/templates', label: 'LaTeX Templates', icon: LayoutTemplate, badge: '4 Designs' },
      { to: '/interview-prep', label: 'Interview Prep', icon: MessageSquareCode, badge: 'AI' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
      { to: '/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

import ThemeToggleSwitch from '../common/ThemeToggleSwitch';

function SidebarContent({ onNavigate, user, onLogout }) {
  return (
    <div
      className="flex flex-col h-full border-r backdrop-blur-xl transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-sidebar, #0e1014)',
        borderColor: 'var(--border-separator, rgba(255, 255, 255, 0.08))',
        color: 'var(--text-primary, #f0f2f7)',
      }}
    >
      {/* Brand Header */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-separator)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                ATS Studio
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
              <ShieldCheck className="w-3 h-3 text-emerald-500 inline" /> ATS Engine v2.4
            </p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Prominent Scan Audit CTA — high contrast in both themes */}
        <div className="px-1">
          <NavLink
            to="/upload"
            onClick={onNavigate}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:translate-y-[-1px] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-hover, #4f46e5)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff' }}
            >
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[13px] font-extrabold tracking-tight">Run ATS Audit</span>
              <span className="text-[10px] font-medium opacity-85">Scan your resume now</span>
            </span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </NavLink>
        </div>

        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              {group.title}
            </p>
            <div className="space-y-1 pt-1">
              {group.items.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'text-[var(--nav-inactive-text)] hover:text-[var(--nav-hover-text)] hover:bg-[var(--nav-hover-bg)]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Pro Tips Card */}
        <div
          className="mx-2 p-3.5 rounded-xl border"
          style={{
            backgroundColor: 'var(--bg-muted)',
            borderColor: 'var(--border-base)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-indigo-400">
            <Layers className="w-4 h-4" /> Overleaf Compatible
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Build and export pure LaTeX or ZIP packages ready for direct Overleaf and HR ATS portals.
          </p>
        </div>
      </nav>

      {/* User Footer */}
      <div
        className="p-3 border-t space-y-2"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-separator)',
        }}
      >
        {/* Theme Switch Row in Sidebar */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Theme Mode</span>
          <ThemeToggleSwitch size="sm" />
        </div>

        {user && (
          <div className="px-3 py-2 rounded-lg flex items-center gap-2.5 border" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-subtle)' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-danger)] hover:bg-[var(--bg-danger)] transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}


export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth?mode=signin');
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800"
        aria-label="Open Navigation"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-30">
        <SidebarContent onNavigate={() => setMobileOpen(false)} user={user} onLogout={handleLogout} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 shadow-2xl z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
