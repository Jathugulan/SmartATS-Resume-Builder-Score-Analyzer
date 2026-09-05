import React, { useState, useEffect } from 'react';
import { GitCompare, X, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Plus, Minus, ArrowRight } from 'lucide-react';
import { versionApi } from '../../api/versionApi';

export default function VersionDiffModal({ isOpen, onClose, resumeId, versions = [] }) {
  const [versionAId, setVersionAId] = useState('');
  const [versionBId, setVersionBId] = useState('');
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (versions.length >= 2) {
      setVersionAId(versions[1]._id);
      setVersionBId(versions[0]._id);
    } else if (versions.length === 1) {
      setVersionAId(versions[0]._id);
      setVersionBId(versions[0]._id);
    }
  }, [versions, isOpen]);

  useEffect(() => {
    if (isOpen && versionAId && versionBId) {
      runCompare();
    }
  }, [versionAId, versionBId, isOpen]);

  const runCompare = async () => {
    if (!versionAId || !versionBId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await versionApi.compareVersions(versionAId, versionBId);
      setDiff(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare versions');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Visual Version Diff</h3>
              <p className="text-xs text-slate-400">Track ATS score changes, keyword additions & edits across iterations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Pickers Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Base Version (Before)</label>
              <select
                value={versionAId}
                onChange={(e) => setVersionAId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none"
              >
                {versions.map((v) => (
                  <option key={v._id} value={v._id}>
                    v{v.versionNumber} - {v.versionName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 text-slate-500">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Version (After)</label>
              <select
                value={versionBId}
                onChange={(e) => setVersionBId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none"
              >
                {versions.map((v) => (
                  <option key={v._id} value={v._id}>
                    v{v.versionNumber} - {v.versionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {diff && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Score Delta:</span>
              <span
                className={`text-sm font-bold flex items-center gap-1 ${
                  diff.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {diff.scoreDelta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {diff.scoreDelta >= 0 ? `+${diff.scoreDelta}` : diff.scoreDelta} pts
              </span>
            </div>
          )}
        </div>

        {/* Diff Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading && (
            <div className="py-12 text-center text-xs text-slate-400">
              Computing version delta...
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {diff && !loading && (
            <>
              {/* Added / Removed Skills Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400">
                    <Plus className="w-4 h-4" /> Added Skills & Keywords ({diff.addedSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(diff.addedSkills || []).length > 0 ? (
                      diff.addedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
                        >
                          +{s}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No newly added skills in this version</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-rose-400">
                    <Minus className="w-4 h-4" /> Removed Skills ({diff.removedSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(diff.removedSkills || []).length > 0 ? (
                      diff.removedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium line-through"
                        >
                          -{s}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No skills removed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* High-level Section Changes */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200">Version Insights</h4>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>
                    Target Role Changed:{' '}
                    <span className="font-semibold text-white">
                      {diff.targetRoleChanged ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li>
                    Executive Summary Refined:{' '}
                    <span className="font-semibold text-white">
                      {diff.summaryChanged ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li>
                    Keyword Density Ratio:{' '}
                    <span className="font-semibold text-white">
                      {diff.versionA?.skillsCount || 0} skills &rarr; {diff.versionB?.skillsCount || 0} skills
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
