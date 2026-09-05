import React, { useState } from 'react';
import { Sparkles, Check, X, ArrowRight, Loader2, Wand2, Lightbulb } from 'lucide-react';
import { intelligenceApi } from '../../api/intelligenceApi';

export default function AiBulletModal({
  isOpen,
  onClose,
  initialBullet = '',
  targetRole = 'Software Engineer',
  onApply,
}) {
  const [bulletText, setBulletText] = useState(initialBullet);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setBulletText(initialBullet);
    setResult(null);
    setError(null);
  }, [initialBullet, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await intelligenceApi.improveBullet({
        bulletText,
        targetRole,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to improve bullet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Bullet Optimizer</h3>
              <p className="text-xs text-slate-400">Google X-Y-Z formula & quantified ATS impact</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input area */}
        <div className="my-4 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Original Bullet Point
          </label>
          <textarea
            rows={3}
            value={bulletText}
            onChange={(e) => setBulletText(e.target.value)}
            placeholder="e.g. Worked on database optimization and helped backend team."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-200 resize-none outline-none transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Target Role: <strong className="text-slate-200">{targetRole}</strong>
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !bulletText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Enhance with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Generated Suggestions */}
        {result && (
          <div className="space-y-3 mt-4 pt-4 border-t border-slate-800 max-h-72 overflow-y-auto pr-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recommended High-Impact Variations
            </h4>

            {/* If backend returns suggestions array or direct improvedBullet */}
            {(result.suggestions || [result.improvedBullet || result.enhanced || bulletText]).map((text, idx) => (
              <div
                key={idx}
                className="group p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex-1 text-xs text-slate-200 leading-relaxed">
                  <p>{typeof text === 'string' ? text : text?.bullet || text?.text || JSON.stringify(text)}</p>
                  {text?.framework && (
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                      {text.framework}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const chosen = typeof text === 'string' ? text : text?.bullet || text?.text || bulletText;
                    onApply(chosen);
                    onClose();
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-medium transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
