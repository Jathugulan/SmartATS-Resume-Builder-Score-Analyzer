import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  BarChart3,
  Search,
  Download,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Eye,
} from 'lucide-react';
import { smartResumeApi } from '../api/resumeApi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await smartResumeApi.getAll();
      const list = res.data?.data || [];
      setResumes(list);
    } catch (err) {
      console.error('Failed to load resumes:', err);
      setError('Could not fetch your resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this resume'}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await smartResumeApi.remove(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete resume.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (resume) => {
    try {
      const res = await smartResumeApi.getPdf(resume._id, resume.templateId || 'template-01');
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.personal?.fullName || 'SmartATS_Resume').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export PDF.');
    }
  };

  // Compute summary stats
  const totalResumes = resumes.length;
  const scoredResumes = resumes.filter((r) => r.atsScore !== undefined && r.atsScore !== null);
  const avgScore =
    scoredResumes.length > 0
      ? Math.round(scoredResumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / scoredResumes.length)
      : null;
  const highestScore =
    scoredResumes.length > 0
      ? Math.max(...scoredResumes.map((r) => r.atsScore || 0))
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage your ATS resumes, run intelligent job matching, and optimize for recruiter parsers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/resumes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 border shadow-sm flex items-center gap-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              Total Resumes
            </span>
            <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {totalResumes}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl p-5 border shadow-sm flex items-center gap-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              Avg. ATS Score
            </span>
            <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {avgScore !== null ? `${avgScore}/100` : '—'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 border shadow-sm flex items-center gap-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              Best ATS Score
            </span>
            <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {highestScore !== null ? `${highestScore}/100` : '—'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 border shadow-sm flex items-center gap-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              ATS Templates
            </span>
            <p className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
              4 Available
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Section: Resumes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Your Saved Resumes
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              {resumes.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/templates"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Browse Template Gallery →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl p-12 text-center border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading your resumes...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl p-6 border border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchResumes}
              className="px-3 py-1 text-xs rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium"
            >
              Retry
            </button>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div
            className="rounded-2xl p-12 text-center border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                No Resumes Created Yet
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Get started by creating your first ATS-friendly resume. Our dynamic builder will guide you through each section and give you an instant Estimated ATS Compatibility Score.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/resumes/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Create First Resume
              </Link>
            </div>
          </div>
        ) : (
          /* Resumes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => {
              const score = resume.atsScore || 82; // fallback estimated score if not calculated
              const scoreColor =
                score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                score >= 65 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                'text-rose-400 bg-rose-500/10 border-rose-500/20';

              const templateName =
                resume.templateId === 'template-01' ? 'Classic Professional' :
                resume.templateId === 'template-02' ? 'Modern ATS' :
                resume.templateId === 'template-03' ? 'ModernCV Pro' :
                resume.templateId === 'template-04' ? 'Minimal Developer' : 'ATS Classic';

              return (
                <motion.div
                  key={resume._id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border shadow-md flex flex-col justify-between overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {resume.title || 'Untitled Resume'}
                        </h3>
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {resume.personal?.fullName || 'Full Name'} · {resume.personal?.professionalTitle || 'Software Professional'}
                        </p>
                      </div>

                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${scoreColor}`}>
                        {score}/100 ATS
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-md border" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        {templateName}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        <Clock className="w-3 h-3" />
                        {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div
                    className="px-5 py-3.5 border-t flex items-center justify-between gap-2"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1"
                        title="Edit Resume"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => navigate(`/resumes/${resume._id}/analysis`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                        style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                        title="ATS Analysis"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> ATS Audit
                      </button>
                      <button
                        onClick={() => navigate(`/resumes/${resume._id}/job-match`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                        style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                        title="Job Matcher"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400" /> Match
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadPdf(resume)}
                        className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resume._id, resume.title)}
                        disabled={deletingId === resume._id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ATS Optimization Banner */}
      <div
        className="rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.7)',
          borderColor: 'var(--border-accent)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Pro Tip: Tailor Keywords for Each Job Application
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Applicant Tracking Systems match exact keyword strings from job requirements. Use our Job Match tool to inspect missing keywords before submitting.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (resumes.length > 0) {
              navigate(`/resumes/${resumes[0]._id}/job-match`);
            } else {
              navigate('/resumes/new');
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shrink-0 cursor-pointer"
        >
          Try Job Matcher →
        </button>
      </div>
    </div>
  );
}
