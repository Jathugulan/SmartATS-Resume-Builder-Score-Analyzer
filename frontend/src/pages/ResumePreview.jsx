import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileCode,
  Edit3,
  BarChart3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { smartResumeApi } from '../api/resumeApi';
import ResumeLivePreview from '../components/builder/ResumeLivePreview';
import { generateClientLatex } from '../utils/clientLatexRenderer';
import { useTheme } from '../context/ThemeContext';

const TEMPLATES = [
  { id: 'template-01', name: 'Classic Professional' },
  { id: 'template-02', name: 'Modern ATS' },
  { id: 'template-03', name: 'ModernCV Pro' },
  { id: 'template-04', name: 'Minimal Developer' },
];

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('template-01');
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [latexSource, setLatexSource] = useState('');

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    setLoading(true);
    try {
      const res = await smartResumeApi.getById(id);
      const data = res.data?.data;
      setResume(data);
      if (data?.templateId) {
        setSelectedTemplate(data.templateId);
      }
      if (data) {
        setLatexSource(generateClientLatex(data, data.templateId || 'template-01'));
      }
    } catch (err) {
      console.error('Failed to load resume for preview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (tplId) => {
    setSelectedTemplate(tplId);
    if (resume) {
      setLatexSource(generateClientLatex(resume, tplId));
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await smartResumeApi.getPdf(id, selectedTemplate);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume?.personal?.fullName || 'SmartATS_Resume').replace(/\s+/g, '_')}_${selectedTemplate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(latexSource);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } catch (err) {
      alert('Failed to copy LaTeX code.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rendering resume preview...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Resume Not Found</h2>
        <Link to="/resumes" className="text-xs font-semibold text-indigo-400 hover:underline">
          Return to My Resumes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to={`/resumes/${id}/edit`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </Link>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {resume.title || 'Resume Preview'}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            High-fidelity vector preview with dynamic LaTeX typesetting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border-base)', backgroundColor: 'var(--bg-card)' }}>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
            <span className="px-2 text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          <button
            onClick={handleCopyLatex}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
          >
            {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLatex ? 'LaTeX Copied!' : 'Copy LaTeX'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={() => navigate(`/resumes/${id}/analysis`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>ATS Audit</span>
          </button>
        </div>
      </div>

      {/* Template Switcher Bar */}
      <div
        className="rounded-2xl p-2.5 border flex items-center gap-2 overflow-x-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
      >
        <span className="text-xs font-bold uppercase tracking-wider px-3" style={{ color: 'var(--text-secondary)' }}>
          Template:
        </span>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleTemplateChange(tpl.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedTemplate === tpl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border hover:bg-black/5 dark:hover:bg-white/5 text-slate-400'
            }`}
            style={
              selectedTemplate === tpl.id
                ? {}
                : { borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }
            }
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Live Preview Container */}
      <div className="flex justify-center overflow-x-auto py-4">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <ResumeLivePreview
            resumeData={resume}
            templateId={selectedTemplate}
            latexSource={latexSource}
          />
        </div>
      </div>
    </div>
  );
}
