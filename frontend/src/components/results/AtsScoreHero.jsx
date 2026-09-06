import { motion } from 'framer-motion';
import { getScoreLabel, getScoreColor, formatScore } from '../../utils/score';

export default function AtsScoreHero({ score, rating }) {
  const label = rating || getScoreLabel(score);
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  // Score-based tone (theme-aware surface tint + border)
  const toneMap = {
    Excellent: 'tone-success',
    Good: 'tone-info',
    'Needs Improvement': 'tone-warning',
    Poor: 'tone-danger',
  };
  const toneClass = toneMap[label] || 'tone-slate';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="surface-card rounded-xl border shadow-sm overflow-hidden"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
        {/* Circular Score Gauge */}
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-muted)" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold leading-none" style={{ color: 'var(--text-primary)' }}>
              {formatScore(score)}
            </span>
            <span className="text-xs theme-text-tertiary font-medium mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider theme-text-tertiary mb-1">
            ATS Compatibility Score
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {formatScore(score)}
            <span className="text-lg theme-text-tertiary font-normal ml-1">/ 100</span>
          </h2>
          <div className="mt-2">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${toneClass}`}>
              {label}
            </span>
          </div>
          <p className="text-sm theme-text-secondary mt-3 leading-relaxed max-w-md">
            {label === 'Excellent' && 'Outstanding ATS compatibility. Your resume is highly optimized for automated screening systems.'}
            {label === 'Good' && 'Good ATS compatibility. Minor improvements could further boost your pass-through rate.'}
            {label === 'Needs Improvement' && 'Your resume needs key improvements to reliably pass ATS filters and reach human reviewers.'}
            {label === 'Poor' && 'Critical gaps detected. Significant restructuring is recommended to meet ATS requirements.'}
          </p>
        </div>

        {/* Score bar visualization */}
        <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-24">
          <div className="relative w-6 h-40 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-full"
              style={{ backgroundColor: color }}
              initial={{ height: 0 }}
              animate={{ height: `${score}%` }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span className="text-xs theme-text-tertiary mt-2 font-medium">{formatScore(score)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
