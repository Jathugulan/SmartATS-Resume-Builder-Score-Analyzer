import React, { useState, useEffect, useRef } from 'react';
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
  UploadCloud,
  FileCode,
  Eye,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { smartResumeApi } from '../api/resumeApi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

export default function MyResumes() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await smartResumeApi.getAll();
      setResumes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this resume'}"?`)) return;
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

  const handleExportJson = (resume) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${(resume.title || 'resume').replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const res = await smartResumeApi.create({
          ...parsed,
          title: `${parsed.title || 'Imported'} (Copy)`,
        });
        if (res.data?.data) {
          setResumes((prev) => [res.data.data, ...prev]);
          navigate(`/resumes/${res.data.data._id}/edit`);
        }
      } catch (err) {
        alert('Invalid JSON resume format.');
      }
    };
    reader.readAsText(file);
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal?.professionalTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && r.templateId === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            My Resumes
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Create, manage, and optimize tailored resumes for multiple job positions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Import JSON</span>
          </button>

          <Link
            to="/resumes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes by title or job role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-base)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'template-01', label: 'Classic' },
            { id: 'template-02', label: 'Modern ATS' },
            { id: 'template-03', label: 'ModernCV' },
            { id: 'template-04', label: 'Minimal Dev' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border text-slate-400 hover:text-white'
              }`}
              style={
                selectedFilter === tab.id
                  ? {}
                  : { borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="rounded-2xl p-12 text-center border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading resume library...</p>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border shadow-sm space-y-4"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              No Resumes Found
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'No resumes match your current search query.' : 'Start building your professional ATS resume now.'}
            </p>
          </div>
          <Link
            to="/resumes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create New Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResumes.map((resume) => {
            const score = resume.atsScore || 85;
            const scoreBadge =
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

                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${scoreBadge}`}>
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

                <div
                  className="px-5 py-3 border-t flex flex-wrap items-center justify-between gap-2"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-separator)' }}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => navigate(`/resumes/${resume._id}/analysis`)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                      style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> ATS Audit
                    </button>
                    <button
                      onClick={() => navigate(`/resumes/${resume._id}/job-match`)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                      style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                    >
                      <Search className="w-3.5 h-3.5 text-cyan-400" /> Match
                    </button>
                    <button
                      onClick={() => navigate(`/resumes/${resume._id}/preview`)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                      style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> Preview
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportJson(resume)}
                      className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }}
                      title="Export JSON"
                    >
                      <FileCode className="w-4 h-4 text-slate-400" />
                    </button>
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
  );
}
