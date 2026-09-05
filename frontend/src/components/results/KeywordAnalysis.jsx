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
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4">Keyword Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasMatched && (
          <div>
            <h4 className="text-sm font-semibold text-emerald-700 mb-2">
              Matched Keywords ({matching.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matching.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-200">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
        {hasMissing && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2">
              Missing Keywords ({matching.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matching.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded border border-red-200">
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
