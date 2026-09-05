import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { reportApi } from '../api/reportApi';
import { formatDate, getScoreColor, formatScore } from '../utils/score';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { Eye, Download, Trash2, FileText, Plus, FileCode, ArrowRight } from 'lucide-react';
import { builderApi } from '../api/builderApi';


export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await resumeApi.getHistory();
      setAnalyses(res.data.data.history || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => fetchHistory(false), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumeApi.deleteAnalysis(deleteTarget);
      setAnalyses((prev) => prev.filter((a) => a.id !== deleteTarget));
      setDeleteTarget(null);
    } catch {
      alert('Failed to delete analysis');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await reportApi.generateReport(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Report_${id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size={32} className="mx-auto mb-4 text-blue-600" />
          <p className="text-slate-500">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchHistory} />;
  }

  if (analyses.length === 0) {
    return (
      <EmptyState
        title="No analyses yet"
        description="Upload your first resume to get an AI-powered ATS analysis."
        action={
          <Button onClick={() => navigate('/upload')}>
            <Plus size={16} className="mr-1.5" />
            Analyze Resume
          </Button>
        }
      />
    );
  }

  const handleOpenInBuilder = async (e, analysisId) => {
    e.stopPropagation();
    try {
      const resume = await builderApi.createFromAnalysis(analysisId);
      navigate(`/builder/${resume._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to open in builder');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Scan & Audit History</h1>
          <p className="text-xs text-slate-400 mt-0.5">{analyses.length} total resume analys{analyses.length === 1 ? 'is' : 'es'}</p>
        </div>
        <Button onClick={() => navigate('/upload')} size="sm">
          <Plus size={16} className="mr-1" />
          New ATS Audit
        </Button>
      </div>

      <div className="space-y-3">
        {analyses.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 p-4 sm:p-5 shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{item.fileName}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">{item.candidateName && item.candidateName !== 'Unknown' ? item.candidateName : 'Candidate'}</span>
                  {item.targetJob && <span>• {item.targetJob}</span>}
                  <span>• {formatDate(item.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    color: getScoreColor(item.atsScore),
                    backgroundColor: getScoreColor(item.atsScore) + '15',
                    borderColor: getScoreColor(item.atsScore) + '35',
                  }}
                >
                  {formatScore(item.atsScore)}
                </div>
                <span className="text-xs text-slate-400 hidden md:block">{item.rating}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleOpenInBuilder(e, item.id)}
                  className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 transition-all cursor-pointer"
                  title="Fix & Edit in Resume Studio"
                >
                  <FileCode size={16} />
                </button>
                <button
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                  title="View Diagnostic Report"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDownload(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                  title="Download Report PDF"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="p-2 rounded-xl hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Analysis"
      >
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this analysis? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
