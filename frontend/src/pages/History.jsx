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
          <LoadingSpinner size={32} className="mx-auto mb-4 theme-text-accent" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Scan &amp; Audit History</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {analyses.length} total resume analys{analyses.length === 1 ? 'is' : 'es'} ·{' '}
            <span className="theme-text-tertiary">Saved diagnostic reports &amp; scores</span>
          </p>
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
            className="surface-card surface-card-hover p-4 sm:p-5 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl icon-tile text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.fileName}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="theme-text-secondary font-medium">{item.candidateName && item.candidateName !== 'Unknown' ? item.candidateName : 'Candidate'}</span>
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
                <span className="text-xs theme-text-tertiary hidden md:block">{item.rating}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleOpenInBuilder(e, item.id)}
                  className="p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer text-indigo-600 dark:text-indigo-300 border"
                  style={{ backgroundColor: 'var(--bg-tag)', borderColor: 'var(--border-accent)' }}
                  title="Fix & Edit in Resume Studio"
                >
                  <FileCode size={16} />
                </button>
                <button
                  onClick={() => navigate(`/results/${item.id}`)}
                  className="p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer border"
                  style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }}
                  title="View Diagnostic Report"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDownload(item.id)}
                  className="p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer border"
                  style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border-base)', color: 'var(--text-secondary)' }}
                  title="Download Report PDF"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-danger)]"
                  style={{ backgroundColor: 'var(--bg-muted)' }}
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
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
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
