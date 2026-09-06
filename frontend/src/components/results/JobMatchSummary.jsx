import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function JobMatchSummary({ jobDescription, matching }) {
  if (!jobDescription?.provided) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card border rounded-xl p-6 text-center"
      >
        <Target className="theme-text-tertiary mx-auto mb-2" size={28} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No Job Description provided</p>
        <p className="text-xs theme-text-tertiary mt-1">Analysis reflects general ATS compatibility</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="surface-card rounded-xl border p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <Target className="tone-text-info" size={20} />
        JD Match Summary
      </h3>

      {jobDescription.targetRole && (
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Target Role:</span> {jobDescription.targetRole}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Matched Skills"
          value={matching?.matchedSkills?.length || 0}
          tone="tone-success"
        />
        <StatCard
          label="Missing Skills"
          value={matching?.missingSkills?.length || 0}
          tone="tone-danger"
        />
        <StatCard
          label="Partial Skills"
          value={matching?.partialSkills?.length || 0}
          tone="tone-warning"
        />
        <StatCard
          label="Matched Keywords"
          value={matching?.matchedKeywords?.length || 0}
          tone="tone-info"
        />
        <StatCard
          label="Missing Keywords"
          value={matching?.missingKeywords?.length || 0}
          tone="tone-warning"
        />
        <StatCard
          label="Required Skills"
          value={jobDescription.requiredSkills?.length || 0}
          tone="tone-info"
        />
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`rounded-lg p-3 border ${tone}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-90">{label}</p>
    </div>
  );
}
