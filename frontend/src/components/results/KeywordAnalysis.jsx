import { motion } from 'framer-motion';

export default function KeywordAnalysis({ matching, jdProvided }) {
  if (!jdProvided || !matching) return null;

  const hasMatched = matching.matchedKeywords?.length > 0;
  const hasMissing = matching.missingKeywords?.length > 0;

  if (!hasMatched && !hasMissing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="surface-card rounded-xl border p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Keyword Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasMatched && (
          <div>
            <h4 className="text-sm font-semibold tone-text-success mb-2">
              Matched Keywords ({matching.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matching.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 tone-success text-xs font-medium rounded border">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
        {hasMissing && (
          <div>
            <h4 className="text-sm font-semibold tone-text-danger mb-2">
              Missing Keywords ({matching.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matching.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 tone-danger text-xs font-medium rounded border">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
