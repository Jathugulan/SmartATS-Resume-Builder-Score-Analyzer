import { motion } from 'framer-motion';
import { formatScore } from '../../utils/score';

export default function ScoreBreakdown({ breakdown, jdProvided = false }) {
  if (!breakdown) return null;

  const categoryLabels = {
    keywordSkillMatch: { label: jdProvided ? 'Keyword / Skill Match' : 'Skill Completeness', max: 30, icon: '🔑' },
    jobDescriptionRelevance: { label: jdProvided ? 'JD Relevance' : 'Profile & Role Cohesion', max: 25, icon: jdProvided ? '📋' : '🎯' },
    atsStructure: { label: 'ATS Structure', max: 15, icon: '🏗️' },
    relevantExperience: { label: 'Relevant Experience', max: 15, icon: '💼' },
    educationCertifications: { label: 'Education & Certs', max: 5, icon: '🎓' },
    achievementsImpact: { label: 'Achievements', max: 5, icon: '🏆' },
    formattingReadability: { label: 'Formatting', max: 5, icon: '📝' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800">Score Breakdown</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
          {jdProvided ? 'Target JD Matching' : 'General ATS Benchmark'}
        </span>
      </div>
      <div className="space-y-4">
        {Object.entries(categoryLabels).map(([key, { label, max, icon }], i) => {
          const item = breakdown[key];
          if (!item) return null;
          const pct = max > 0 ? Math.min(100, (item.weighted / max) * 100) : 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">
                  <span className="mr-1.5">{icon}</span>
                  {label}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {formatScore(item.raw)}<span className="text-slate-400 font-normal">/100</span>
                  <span className="text-slate-300 mx-1">&middot;</span>
                  <span className="text-blue-600 font-bold">{item.weighted} pts</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i + 0.3 }}
                  className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                />
              </div>
              {item.explanation && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.explanation}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
