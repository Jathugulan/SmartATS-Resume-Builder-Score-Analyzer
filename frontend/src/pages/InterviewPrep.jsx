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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Resume-Grounded Behavioral & Technical AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Interview Preparation Studio
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Practice realistic behavioral, STAR-method, and technical interview questions synthesized directly from your resume's experiences and projects.
          </p>
        </div>
      </div>

      {/* Configuration Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <label className="text-xs font-semibold text-slate-300 block mb-1">Select Source Resume</label>
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
          <label className="text-xs font-semibold text-slate-300 block mb-1">Target Position / Role</label>
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
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
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
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
                      activeQuestionIdx === idx
                        ? 'bg-indigo-600 text-white font-semibold shadow'
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
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
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Question #{activeQuestionIdx + 1}
              </div>
              <p className="text-base font-semibold text-white leading-relaxed">
                {questionText}
              </p>
              {typeof currentQuestion === 'object' && currentQuestion?.context && (
                <p className="text-xs text-slate-400 mt-1 italic">
                  Context: {currentQuestion.context}
                </p>
              )}
            </div>

            {/* Answer Input */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Your Answer (Use the STAR Method: Situation, Task, Action, Result)
              </label>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or paste your response here..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
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
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">AI Recruiter Evaluation</h4>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    Score: {evaluation.score || evaluation.overallScore || 85}/100
                  </div>
                </div>

                {evaluation.feedback && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {typeof evaluation.feedback === 'string' ? evaluation.feedback : evaluation.feedback.summary}
                  </p>
                )}

                {evaluation.starBreakdown && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {Object.entries(evaluation.starBreakdown).map(([letter, desc]) => (
                      <div key={letter} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                        <span className="font-bold text-indigo-300 uppercase block">{letter}</span>
                        <span className="text-slate-400">{desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {evaluation.suggestedImprovement && (
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-300">
                    <strong>Suggested Pro Tip:</strong> {evaluation.suggestedImprovement}
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
