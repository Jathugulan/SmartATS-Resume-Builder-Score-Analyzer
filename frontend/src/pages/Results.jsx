import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeApi } from '../api/resumeApi';
import { reportApi } from '../api/reportApi';
import { builderApi } from '../api/builderApi';
import CandidateCard from '../components/results/CandidateCard';
import AtsScoreHero from '../components/results/AtsScoreHero';
import ScoreBreakdown from '../components/results/ScoreBreakdown';
import ScoreChart from '../components/results/ScoreChart';
import SkillsSection from '../components/results/SkillsSection';
import KeywordAnalysis from '../components/results/KeywordAnalysis';
import AtsRisks from '../components/results/AtsRisks';
import Strengths from '../components/results/Strengths';
import Weaknesses from '../components/results/Weaknesses';
import Recommendations from '../components/results/Recommendations';
import JobMatchSummary from '../components/results/JobMatchSummary';
import FinalVerdict from '../components/results/FinalVerdict';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';
import { Download, ArrowLeft, Sparkles, ArrowRight, FileCode } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [convertingToBuilder, setConvertingToBuilder] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await resumeApi.getAnalysis(id);
        setAnalysis(res.data.data.analysis);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await reportApi.generateReport(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Report_${analysis?.candidate?.fullName || 'Candidate'}_${id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // When responseType is 'blob', axios wraps error responses as Blob objects.
      // We need to read the blob to get the real error message.
      let message = 'Failed to generate report. Please try again.';
      try {
        const errorBlob = err.response?.data;
        if (errorBlob instanceof Blob) {
          const text = await errorBlob.text();
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      } catch {
        // fallback to generic message
      }
      alert(message);
    } finally {
      setDownloading(false);
    }
  };

  const handleCandidateUpdate = async (updatedFields) => {
    const res = await resumeApi.updateCandidate(id, updatedFields);
    setAnalysis(res.data.data.analysis);
  };

  const handleOpenInBuilder = async () => {
    setConvertingToBuilder(true);
    try {
      const newResume = await builderApi.createFromAnalysis(id);
      navigate(`/builder/${newResume._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize resume builder');
    } finally {
      setConvertingToBuilder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size={32} className="mx-auto mb-4 text-blue-600" />
          <p className="text-slate-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!analysis) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-sm theme-text-tertiary hover:theme-text-secondary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to History
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenInBuilder}
            disabled={convertingToBuilder}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow transition-all cursor-pointer"
          >
            <FileCode size={15} />
            <span>{convertingToBuilder ? 'Transferring...' : 'Fix in Resume Studio'}</span>
          </button>
          <Button onClick={handleDownload} loading={downloading} variant="secondary" size="sm">
            <Download size={16} className="mr-1.5" />
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Candidate info card */}
      <CandidateCard candidate={analysis.candidate} onUpdate={handleCandidateUpdate} />

      {/* ATS Score Hero */}
      <AtsScoreHero score={analysis.atsScore} rating={analysis.rating} />

      {/* 1-Click Fix & Optimize in Resume Studio Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background:
            'radial-gradient(120% 120% at 95% 0%, var(--accent-glow) 0%, transparent 55%), linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
          borderColor: 'var(--border-accent)',
        }}
      >
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider theme-text-accent">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click ATS Auto-Fix
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Optimize this resume in the Interactive Resume Studio
          </h3>
          <p className="text-xs max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Automatically transfer parsed skills, work experience, and personal entities into an ATS-tested LaTeX template with live score simulation and AI bullet enhancements.
          </p>
        </div>
        <button
          onClick={handleOpenInBuilder}
          disabled={convertingToBuilder}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
        >
          <FileCode className="w-4 h-4" />
          <span>{convertingToBuilder ? 'Transferring Data...' : 'Fix in Resume Studio'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Score Breakdown */}

      <ScoreBreakdown
        breakdown={analysis.scoreBreakdown}
        jdProvided={analysis.jobDescription?.provided}
      />

      <ScoreChart
        breakdown={analysis.scoreBreakdown}
        jdProvided={analysis.jobDescription?.provided}
      />

      <JobMatchSummary
        jobDescription={analysis.jobDescription}
        matching={analysis.matching}
      />

      <SkillsSection
        skills={analysis.skills}
        matching={analysis.matching}
        jdProvided={analysis.jobDescription?.provided}
      />

      <KeywordAnalysis
        matching={analysis.matching}
        jdProvided={analysis.jobDescription?.provided}
      />

      <AtsRisks risks={analysis.atsRisks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Strengths strengths={analysis.strengths} />
        <Weaknesses weaknesses={analysis.weaknesses} />
      </div>

      <Recommendations recommendations={analysis.recommendations} />

      <FinalVerdict
        verdict={analysis.finalVerdict}
        parsingConfidence={analysis.parsingConfidence}
      />

      <div className="flex justify-center pt-4 pb-8">
        <Button onClick={handleDownload} loading={downloading} size="lg">
          <Download size={18} className="mr-2" />
          Download Full PDF Report
        </Button>
      </div>
    </div>
  );
}
