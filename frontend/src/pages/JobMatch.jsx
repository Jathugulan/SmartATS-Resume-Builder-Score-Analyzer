import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Edit3,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { smartResumeApi } from '../api/resumeApi';
import { useTheme } from '../context/ThemeContext';

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Senior Full Stack Engineer',
    text: `Responsibilities:
- Build high-scale web applications using React, TypeScript, Node.js, and PostgreSQL.
- Design resilient microservices architectures deployed to AWS and Docker container environments.
- Implement GraphQL and RESTful APIs with automated Jest unit and integration testing.
- Collaborate across distributed agile engineering teams and champion CI/CD best practices using GitHub Actions.

Requirements:
- 4+ years of professional full-stack development experience.
- Strong proficiency in TypeScript, React, Node.js, Redis, and relational database modeling.
- Experience with Kubernetes or container orchestration is a plus.`,
  },
  {
    title: 'Cloud DevOps / Platform Engineer',
    text: `Responsibilities:
- Maintain multi-region cloud infrastructure using Terraform, Kubernetes, and AWS.
- Build automated continuous deployment pipelines with GitHub Actions and Docker.
- Implement Prometheus, Grafana telemetry, and centralized logging.
- Ensure 99.99% system reliability, incident management, and automated failover.

Requirements:
- Strong Linux systems administration, Go, Python, and Bash scripting.
- Deep hands-on experience with AWS, Docker, Kubernetes, and Helm.`,
  },
];

export default function JobMatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loadingResume, setLoadingResume] = useState(true);
  const [matching, setMatching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    setLoadingResume(true);
    try {
      const res = await smartResumeApi.getById(id);
      setResume(res.data?.data);
    } catch (err) {
      console.error('Failed to load resume for job match:', err);
      setError('Could not load resume. Please check the resume ID.');
    } finally {
      setLoadingResume(false);
    }
  };

  const handleRunMatch = async (e) => {
    e?.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setMatching(true);
    setError(null);
    try {
      const res = await smartResumeApi.jobMatch(id, jobDescription);
      setResult(res.data?.data);
    } catch (err) {
      console.error('Match error:', err);
      setError(err.response?.data?.message || 'Failed to compare resume with job description.');
    } finally {
      setMatching(false);
    }
  };

  if (loadingResume) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading resume details...</p>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{error}</h2>
        <Link to="/resumes" className="text-sm font-semibold text-indigo-400 hover:underline">
          Return to My Resumes
        </Link>
      </div>
    );
  }

  const matchScore = result?.jobMatchScore ?? null;
  const matchedKeywords = result?.matchedKeywords ?? [];
  const missingKeywords = result?.missingKeywords ?? [];
  const recommendations = result?.recommendations ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="space-y-2">
        <Link
          to={`/resumes/${id}/analysis`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to ATS Audit
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Job Description Matcher
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Compare <strong style={{ color: 'var(--text-primary)' }}>{resume?.title || 'your resume'}</strong> against specific employer job requirements.
            </p>
          </div>
          <button
            onClick={() => navigate(`/resumes/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-all self-start sm:self-auto cursor-pointer"
            style={{ borderColor: 'var(--border-base)', color: 'var(--text-primary)' }}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Resume Editor</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-lg space-y-5"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label
            htmlFor="jobDesc"
            className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Target Job Description / Requirements</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Try sample:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJobDescription(s.text)}
                className="text-xs px-2.5 py-1 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-indigo-400"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="jobDesc"
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description, requirements, or responsibilities here..."
            className="w-full p-4 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all leading-relaxed"
            style={{
              backgroundColor: 'var(--bg-base)',
              borderColor: 'var(--border-base)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict zero-fabrication matching. Heuristics extract exact keyword matches.</span>
          </div>

          <button
            onClick={handleRunMatch}
            disabled={matching || !jobDescription.trim()}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {matching ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Comparing Keywords...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Job Match</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Match Score Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-accent)' }}
          >
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Job Description Match Score
              </span>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-5xl font-black text-emerald-400">
                  {matchScore}%
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {matchScore >= 80 ? 'High Relevance' : matchScore >= 60 ? 'Moderate Match' : 'Keyword Gaps Found'}
                </span>
              </div>
              <p className="text-xs max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Identified {matchedKeywords.length} matching skills and {missingKeywords.length} keywords found in the job requirements that could strengthen your resume.
              </p>
            </div>

            <button
              onClick={() => navigate(`/resumes/${id}/edit`)}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Resume in Editor</span>
            </button>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div
              className="rounded-2xl p-6 border shadow-sm space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Matched Keywords ({matchedKeywords.length})
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-400">Present in Resume</span>
              </div>

              {matchedKeywords.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  No exact matching keywords found from this description.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Keywords */}
            <div
              className="rounded-2xl p-6 border shadow-sm space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Missing Keywords ({missingKeywords.length})
                  </h3>
                </div>
                <span className="text-xs font-semibold text-amber-400">In Job Posting</span>
              </div>

              {missingKeywords.length === 0 ? (
                <p className="text-xs text-emerald-400">
                  Great job! Your resume covers all primary keywords from this posting.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-amber-500/10 text-amber-300 border-amber-500/20"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--text-tertiary)' }}>
                    *Only include these keywords if you actually possess experience with them. Never fabricate skills to game ATS systems.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div
              className="rounded-2xl p-6 border shadow-sm space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Alignment Recommendations
                </h3>
              </div>

              <div className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span style={{ color: 'var(--text-secondary)' }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
