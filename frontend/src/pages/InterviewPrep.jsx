import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  ArrowRight,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { builderApi } from '../api/builderApi';
import { intelligenceApi } from '../api/intelligenceApi';


export default function InterviewPrep() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await builderApi.getResumes();
      setResumes(data);
      if (data.length > 0) {
        setSelectedResumeId(data[0]._id);
        setTargetRole(data[0].targetRole || 'Software Engineer');
      }
    } catch (err) {
      console.error('Failed to load resumes for interview prep:', err);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedResumeId) return;
    setGenerating(true);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const data = await intelligenceApi.getInterviewQuestions(selectedResumeId, targetRole);
      // data might be { questions: [...] } or array
      const qList = data?.questions || (Array.isArray(data) ? data : []);
      setQuestions(qList);
      setActiveQuestionIdx(0);
    } catch (err) {
      alert('Failed to generate interview questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || questions.length === 0) return;
    setEvaluating(true);
    try {
      const currentQ = questions[activeQuestionIdx];
      const qText = typeof currentQ === 'string' ? currentQ : currentQ?.question || currentQ?.text;
      const data = await intelligenceApi.evaluateInterviewAnswer({
        question: qText,
        answer: userAnswer,
      });
      setEvaluation(data);
    } catch (err) {
      alert('Failed to evaluate answer');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQuestion = questions[activeQuestionIdx];
  const questionText = typeof currentQuestion === 'string' ? currentQuestion : currentQuestion?.question || currentQuestion?.text;

  // Normalize the evaluation payload returned by the backend
  // (relevanceScore / clarityScore / technicalDepth / feedbackText / modelAnswerSnippet)
  // while keeping backwards-compatibility with any alternate field names.
  const evaluationMetrics = (() => {
    if (Array.isArray(evaluation?.starBreakdown)) return evaluation.starBreakdown;
    if (evaluation?.starBreakdown && typeof evaluation.starBreakdown === 'object') {
      return Object.entries(evaluation.starBreakdown).map(([letter, description]) => ({
        key: letter,
        value: null,
        full: null,
        description,
      }));
    }
    if (evaluation?.relevanceScore != null) {
      return [
        { key: 'Relevance', value: evaluation.relevanceScore, description: 'How well you stayed on topic and addressed the question.', full: evaluation.relevanceScore / 10 },
        { key: 'Clarity', value: evaluation.clarityScore, description: 'How clearly and concisely you expressed your ideas.', full: evaluation.clarityScore / 10 },
        { key: 'Technical Depth', value: evaluation.technicalDepth, description: 'Depth of technical reasoning and specific detail.', full: evaluation.technicalDepth / 10 },
      ];
    }
    return null;
  })();

  const evaluationScore =
    evaluation?.score ||
    evaluation?.overallScore ||
    (Array.isArray(evaluationMetrics) && evaluationMetrics.some((m) => m.value != null)
      ? Math.round((evaluationMetrics.reduce((sum, m) => sum + (m.value || 0), 0) / evaluationMetrics.length) * 10)
      : null);

  const evaluationFeedback =
    evaluation?.feedbackText ||
    (typeof evaluation?.feedback === 'string' ? evaluation.feedback : evaluation?.feedback?.summary) ||
    null;

  const evaluationTip = evaluation?.modelAnswerSnippet || evaluation?.suggestedImprovement || null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl"
        style={{
          background:
            'radial-gradient(120% 120% at 95% 0%, var(--accent-glow) 0%, transparent 55%), linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
          borderColor: 'var(--border-accent)',
        }}
      >
        <div className="space-y-2 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ backgroundColor: 'var(--bg-tag)', color: 'var(--text-accent)', borderColor: 'var(--border-accent)' }}
          >
            <Sparkles className="w-3.5 h-3.5 theme-text-accent" />
            Resume-Grounded Behavioral &amp; Technical AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            AI Interview Preparation Studio
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Practice realistic behavioral, STAR-method, and technical interview questions synthesized directly from your resume's experiences and projects.
          </p>
        </div>
      </div>

      {/* Configuration Bar */}
      <div className="p-5 rounded-2xl surface-card surface-card-hover flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Select Source Resume</label>
          <select
            value={selectedResumeId}
            onChange={(e) => {
              setSelectedResumeId(e.target.value);
              const found = resumes.find((r) => r._id === e.target.value);
              if (found?.targetRole) setTargetRole(found.targetRole);
            }}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title} ({r.targetRole || 'General'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Target Position / Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-5">
          <button
            onClick={handleGenerateQuestions}
            disabled={generating || !selectedResumeId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition-all cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Questions...</span>
              </>
            ) : (
              <>
                <MessageSquareCode className="w-4 h-4" />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interview Interactive Session */}
      {questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Navigator */}
          <div className="p-4 rounded-2xl theme-surface-card theme-border border space-y-2">
            <h3 className="text-xs font-bold theme-text-tertiary uppercase tracking-wider mb-3">
              Interview Questions ({questions.length})
            </h3>
            <div className="space-y-1.5">
              {questions.map((q, idx) => {
                const text = typeof q === 'string' ? q : q?.question || q?.text;
                const category = typeof q === 'object' ? q?.category || q?.type : 'Question';
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setUserAnswer('');
                      setEvaluation(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all cursor-pointer ${
                      activeQuestionIdx === idx
                        ? 'bg-indigo-600 text-white font-semibold shadow'
                        : 'theme-surface-elevated theme-text-secondary hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase tracking-wider opacity-75">
                        Q{idx + 1} • {category}
                      </span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed">{text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Response & Evaluation Area */}
          <div className="lg:col-span-2 space-y-5">
            {/* Active Question Box */}
            <div className="p-5 rounded-2xl theme-surface-card theme-border border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold theme-text-accent uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Question #{activeQuestionIdx + 1}
              </div>
              <p className="text-base font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {questionText}
              </p>
              {typeof currentQuestion === 'object' && currentQuestion?.context && (
                <p className="text-xs theme-text-tertiary mt-1 italic">
                  Context: {currentQuestion.context}
                </p>
              )}
            </div>

            {/* Answer Input */}
            <div className="p-5 rounded-2xl theme-surface-card theme-border border space-y-3">
              <label className="text-xs font-semibold block" style={{ color: 'var(--text-secondary)' }}>
                Your Answer (Use the STAR Method: Situation, Task, Action, Result)
              </label>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or paste your response here..."
                className="w-full px-4 py-3 rounded-xl text-sm resize-none leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Evaluate Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Evaluation Results Card */}
            {evaluation && (
              <div className="p-5 rounded-2xl surface-card space-y-4">
                <div className="flex items-center justify-between pb-3 theme-divider border-b">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 theme-text-accent" />
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Recruiter Evaluation</h4>
                  </div>
                  {evaluationScore != null && (
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-bold ${
                        evaluationScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : evaluationScore >= 60
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                      }`}
                    >
                      Score: {evaluationScore}/100
                    </div>
                  )}
                </div>

                {evaluationFeedback && (
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {evaluationFeedback}
                  </p>
                )}

                {Array.isArray(evaluationMetrics) && evaluationMetrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {evaluationMetrics.map((metric) => {
                      const hasValue = metric.value != null;
                      const pct = metric.full != null ? metric.full * 100 : (metric.value || 0) * 10;
                      return (
                        <div key={metric.key} className="p-3 rounded-xl theme-surface-elevated theme-border border">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-indigo-600 dark:text-indigo-300 uppercase text-[10px] tracking-wide">{metric.key}</span>
                            {hasValue ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{metric.value}/10</span>
                            ) : (
                              <span className="theme-text-tertiary font-bold text-sm">—</span>
                            )}
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: hasValue ? `${Math.max(4, Math.min(100, pct))}%` : '0%' }} />
                          </div>
                          {metric.description && <p className="text-[11px] theme-text-tertiary mt-1.5 leading-snug">{metric.description}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {evaluationTip && (
                  <div className="p-3.5 rounded-xl text-xs theme-text-accent border" style={{ backgroundColor: 'var(--bg-tag)', borderColor: 'var(--border-accent)' }}>
                    <strong>Pro Tip:</strong> {evaluationTip}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
