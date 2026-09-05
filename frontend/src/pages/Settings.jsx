import React from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggleSwitch from '../components/common/ThemeToggleSwitch';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Settings & Preferences
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Configure application appearance, data privacy, and ATS scoring preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Appearance & Theme
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Select your preferred visual style across all editor and public surfaces.
          </p>

          <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {isDark ? 'Dark Mode (Deep Navy SaaS)' : 'Light Mode (High-Contrast White)'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Curated palette with high WCAG contrast and smooth transitions.
                </p>
              </div>
            </div>

            <ThemeToggleSwitch size="md" />
          </div>
        </div>

        {/* ATS Scoring Standards Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              ATS Scoring Standards
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            SmartATS uses a transparent 6-dimension evaluation framework conforming to standard ATS parsing algorithms (Taleo, Greenhouse, Workday, Lever).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { label: 'Formatting & Layout', weight: '20% Weight' },
              { label: 'Keyword Density & Terminology', weight: '25% Weight' },
              { label: 'Technical Skills Taxonomy', weight: '20% Weight' },
              { label: 'Experience & Quantifiable Metrics', weight: '15% Weight' },
              { label: 'Education Completeness', weight: '10% Weight' },
              { label: 'Content Structure & Brevity', weight: '10% Weight' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border flex items-center justify-between text-xs"
                style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                <span className="font-semibold text-indigo-400">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical AI & Privacy */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Privacy & Zero-Fabrication Guarantee
            </h2>
          </div>
          <div className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              • <strong>Zero Fabrication:</strong> SmartATS never generates fictitious degrees, employers, or skills you have not attained.
            </p>
            <p>
              • <strong>Your Data Belongs to You:</strong> You can export all your resumes as JSON or raw LaTeX at any moment.
            </p>
            <p>
              • <strong>No Data Resale:</strong> Your resumes and job description inputs are confidential and are never sold to third-party recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
