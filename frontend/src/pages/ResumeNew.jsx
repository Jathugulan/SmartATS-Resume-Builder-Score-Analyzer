import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { smartResumeApi } from '../api/resumeApi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const TEMPLATES = [
  {
    id: 'template-01',
    name: 'Classic Professional',
    category: 'Traditional Corporate',
    badge: '98% ATS Pass',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Clean serif accents, horizontal rules, and clear hierarchy. Ideal for finance, management, and traditional corporate sectors.',
    recommendedFor: 'Finance, Banking, Executive, Management',
    features: ['Single-column ATS flow', 'Clear visual dividers', 'Conservative formatting'],
  },
  {
    id: 'template-02',
    name: 'Modern ATS',
    category: 'Software & Technology',
    badge: 'Highest Technical Parse',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    description: 'Crisp sans-serif, compact vertical margins, and categorized skills grid. Optimized for software engineering and technical roles.',
    recommendedFor: 'Full Stack, DevOps, Data Science, Cloud',
    features: ['Categorized technical skills', 'Project URL links', 'Metric-focused bullets'],
  },
  {
    id: 'template-03',
    name: 'ModernCV Professional',
    category: 'European / International',
    badge: 'International Standard',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: 'Elegant dual-toned headers, modern styling, and balanced whitespace. High parsing rate for multinational and academic applications.',
    recommendedFor: 'Research, Academia, Engineering, Europe/UK',
    features: ['Distinguished header bar', 'Chronological milestone format', 'Multilingual support'],
  },
  {
    id: 'template-04',
    name: 'Minimal Developer',
    category: 'Developer & Startup',
    badge: 'Compact & Direct',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Monospaced accents, ultra-compact margins, and dense information layout. Maximum content in minimum page footprint.',
    recommendedFor: 'Open Source Devs, Systems Engineers, Startups',
    features: ['Monospaced accents', 'Compact spacing', 'Zero-fluff layout'],
  },
];

export default function ResumeNew() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('My ATS Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('template-01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await smartResumeApi.create({
        title: title.trim() || 'My ATS Resume',
        templateId: selectedTemplate,
      });
      const newResume = res.data?.data;
      if (newResume && newResume._id) {
        navigate(`/resumes/${newResume._id}/edit`);
      } else {
        navigate('/resumes');
      }
    } catch (err) {
      console.error('Failed to create resume:', err);
      setError('Could not initialize resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Create New ATS Resume
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select an ATS-tested LaTeX design to get started. You can change templates anytime without losing your content.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-8">
        {/* Title Input */}
        <div
          className="rounded-2xl p-6 border shadow-sm space-y-3"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <label
            htmlFor="resumeTitle"
            className="block text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Resume Name / Target Role
          </label>
          <input
            id="resumeTitle"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer - Cloud ATS"
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            style={{
              backgroundColor: 'var(--bg-base)',
              borderColor: 'var(--border-base)',
              color: 'var(--text-primary)',
            }}
          />
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            This title helps you organize multiple resumes tailored for specific job positions.
          </p>
        </div>

        {/* Template Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Choose Starting LaTeX Template
            </h2>
            <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> All 4 follow the fixed 7-section ATS hierarchy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`rounded-2xl p-6 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'hover:border-indigo-500/40'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: isSelected ? 'var(--border-accent)' : 'var(--border-base)',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                          {tpl.category}
                        </span>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          {tpl.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${tpl.badgeColor}`}>
                        {tpl.badge}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {tpl.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      {tpl.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-separator)' }}>
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      Best for: <strong style={{ color: 'var(--text-primary)' }}>{tpl.recommendedFor}</strong>
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/dashboard"
            className="px-5 py-3 rounded-xl border text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            style={{ borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Initializing...</span>
            ) : (
              <>
                <span>Launch Dynamic Editor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
