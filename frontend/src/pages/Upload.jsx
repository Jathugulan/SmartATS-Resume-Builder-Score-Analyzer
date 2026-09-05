import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import ResumeUploader from '../components/upload/ResumeUploader';
import JobDescriptionInput from '../components/upload/JobDescriptionInput';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { FileSearch, Shield, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const handleAnalyze = useCallback(async () => {
    if (!file || loading) return;
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setError('');
    setLoading(true);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription && jobDescription.trim().length > 10) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const res = await resumeApi.analyze(formData, abortControllerRef.current.signal);
      const analysisId = res.data.data.analysisId || res.data.data.analysis?._id;
      if (analysisId) {
        navigate(`/results/${analysisId}`);
      } else {
        setError('Analysis completed but no ID was returned.');
      }
    } catch (err) {
      // Don't show error if request was intentionally aborted
      if (err.name === 'AbortError' || err.message === 'canceled') {
        return;
      }
      const msg = err.response?.data?.message || 'Analysis failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [file, jobDescription, loading, navigate]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          7-Dimensional Scoring & Verification Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>ATS Resume Diagnostic Audit</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload your resume to uncover parsing bottlenecks, missing keywords, and ATS risks before applying.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Upload Resume Document</h3>
            <ResumeUploader file={file} setFile={setFile} />
          </Card>

          <Card className="p-6">
            <JobDescriptionInput jobDescription={jobDescription} setJobDescription={setJobDescription} />
          </Card>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl px-4 py-3">{error}</div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file}
            loading={loading}
            size="lg"
            className="w-full font-semibold shadow-lg"
          >
            {loading ? 'Running Full Diagnostic Audit...' : 'Run ATS Audit'}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Deep Semantic Matching</h4>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Comprehensive keyword extraction & ontology graph matching</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>7-Category Scoring Model</h4>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Format, Impact, Skills, Experience, Education & Readability</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>1-Click Builder Handoff</h4>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Seamlessly transfer issues into the Resume Studio to fix instantly</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>PDF & DOCX Robust Parsing</h4>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Zero data fabrication with full evidence verification</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

}
