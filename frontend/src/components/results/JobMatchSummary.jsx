import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function JobMatchSummary({ jobDescription, matching }) {
  if (!jobDescription?.provided) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center"
      >
        <Target className="text-slate-400 mx-auto mb-2" size={28} />
        <p className="text-sm font-medium text-slate-500">No Job Description provided</p>
        <p className="text-xs text-slate-400 mt-1">Analysis reflects general ATS compatibility</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="text-blue-500" size={20} />
        JD Match Summary
      </h3>

      {jobDescription.targetRole && (
        <p className="text-sm text-slate-600 mb-3">
          <span className="font-semibold">Target Role:</span> {jobDescription.targetRole}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Matched Skills"
          value={matching?.matchedSkills?.length || 0}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          label="Missing Skills"
          value={matching?.missingSkills?.length || 0}
          color="text-red-600 bg-red-50"
        />
        <StatCard
          label="Partial Skills"
          value={matching?.partialSkills?.length || 0}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          label="Matched Keywords"
          value={matching?.matchedKeywords?.length || 0}
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          label="Missing Keywords"
          value={matching?.missingKeywords?.length || 0}
          color="text-orange-600 bg-orange-50"
        />
        <StatCard
          label="Required Skills"
          value={jobDescription.requiredSkills?.length || 0}
          color="text-violet-600 bg-violet-50"
        />
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}
