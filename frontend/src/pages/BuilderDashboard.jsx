import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCode,
  Plus,
  Trash2,
  Edit3,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Archive,
} from 'lucide-react';
import { builderApi } from '../api/builderApi';
import { templateApi } from '../api/templateApi';
import AtsScoreGauge from '../components/builder/AtsScoreGauge';


export default function BuilderDashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('Software Engineer');
  const [selectedTemplate, setSelectedTemplate] = useState('template-01');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resumesData, templatesData] = await Promise.all([
        builderApi.getResumes(),
        templateApi.getTemplates(),
      ]);
      setResumes(resumesData);
      setTemplates(templatesData);
    } catch (err) {
      console.error('Failed to load builder dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const created = await builderApi.createResume({
        title: newTitle.trim(),
        targetRole: newRole.trim(),
        templateId: selectedTemplate,
      });
      setIsCreateModalOpen(false);
      navigate(`/builder/${created._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume? This will also remove its version history.')) return;
    try {
      await builderApi.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const filteredResumes = resumes.filter((r) =>
    (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.targetRole || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero / Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Overleaf & LaTeX Vector Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interactive ATS Resume Builder Studio
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Design Fortune 500 ATS-compatible resumes with real-time score simulation, automated LaTeX rendering, version snapshots, and 1-click Overleaf export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Template Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or target role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredResumes.length}</strong> resume{filteredResumes.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading your resume studio...
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No resumes created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Start from scratch or run an ATS audit on your existing resume to convert it into an editable LaTeX template with 1 click.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Build First Resume
            </button>
            <Link
              to="/upload"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Analyze Existing Resume
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume._id}
              onClick={() => navigate(`/builder/${resume._id}`)}
              className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-5 shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      v{resume.currentVersion || 1}.0
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, resume._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">
                  {resume.targetRole || 'Software Engineer'}
                </p>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {resume.summary || 'Custom tailored resume for ATS evaluation and recruiter screening.'}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                  Open Studio <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Resume Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Create New Resume</h3>
            <p className="text-xs text-slate-400 mb-4">
              Initialize a clean resume workspace with real-time ATS optimization.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Resume Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Fullstack Engineer 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">LaTeX Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="template-01">Jake's Resume (Single Column ATS Standard)</option>
                  <option value="template-02">Modern Academic / Engineering (High ATS Score)</option>
                  <option value="template-03">Executive Leadership Minimalist</option>
                  {templates.map((t) => (
                    <option key={t.templateId} value={t.templateId}>
                      {t.name} ({t.layoutType || 'custom'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  {creating ? 'Creating...' : 'Create & Open Studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
